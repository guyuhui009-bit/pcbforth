import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";
import { adminProcedure, publicProcedure, router } from "../_core/trpc";
import { addQuoteFile, createQuoteRequest, getQuoteRequestById, listQuoteRequests, updateQuoteStatus } from "../quoteDb";
import { storagePut } from "../storage";

// ── Input schemas ──────────────────────────────────────────────────────────

const UploadFileInput = z.object({
  /** Original filename (e.g. "board.zip") */
  fileName: z.string().min(1).max(512),
  /** MIME type (e.g. "application/zip") */
  mimeType: z.string().max(128).default("application/octet-stream"),
  /** Base64-encoded file content */
  base64: z.string(),
  /** File size in bytes */
  fileSize: z.number().int().nonnegative().optional(),
});

const SubmitQuoteInput = z.object({
  // Contact
  contactName: z.string().min(1).max(128),
  contactEmail: z.string().email().max(320),
  contactPhone: z.string().max(64).optional(),
  company: z.string().max(256).optional(),

  // PCB specs
  pcbType: z.enum(["pcb", "fpc", "rigid_flex", "semi_test", "other"]).default("pcb"),
  layers: z.number().int().min(1).max(100).optional(),
  quantity: z.number().int().min(1).optional(),
  boardWidth: z.number().positive().optional(),
  boardHeight: z.number().positive().optional(),
  boardThickness: z.number().positive().optional(),

  surfaceFinish: z.string().max(64).optional(),
  material: z.string().max(128).optional(),
  copperWeight: z.string().max(32).optional(),

  // Services (JSON array stored as text)
  services: z.array(z.string()).optional(),
  notes: z.string().max(4000).optional(),

  // Uploaded file keys returned from uploadFile mutation
  fileKeys: z.array(
    z.object({
      key: z.string(),
      url: z.string(),
      originalName: z.string(),
      mimeType: z.string().optional(),
      fileSize: z.number().optional(),
    })
  ).optional(),
});

// ── Router ─────────────────────────────────────────────────────────────────

export const quoteRouter = router({
  /**
   * Upload a single file and return its storage key + URL.
   * Public — no login required so customers can attach files before submitting.
   */
  uploadFile: publicProcedure.input(UploadFileInput).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.base64, "base64");
    const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._\-]/g, "_");
    const { key, url } = await storagePut(
      `quote-files/${safeFileName}`,
      buffer,
      input.mimeType,
    );
    return { key, url, originalName: input.fileName };
  }),

  /**
   * Submit a complete quote request with optional file references.
   */
  submit: publicProcedure.input(SubmitQuoteInput).mutation(async ({ input }) => {
    const { fileKeys = [], services, ...rest } = input;

    const quoteId = await createQuoteRequest({
      ...rest,
      boardWidth: rest.boardWidth ? String(rest.boardWidth) : undefined,
      boardHeight: rest.boardHeight ? String(rest.boardHeight) : undefined,
      boardThickness: rest.boardThickness ? String(rest.boardThickness) : undefined,
      services: services ? JSON.stringify(services) : undefined,
      status: "pending",
    });

    // Attach uploaded files
    for (const f of fileKeys) {
      await addQuoteFile({
        quoteId,
        originalName: f.originalName,
        fileKey: f.key,
        fileUrl: f.url,
        mimeType: f.mimeType,
        fileSize: f.fileSize,
      });
    }

    // Notify site owner
    try {
      await notifyOwner({
        title: `新报价请求 #${quoteId} — ${input.contactName}`,
        content: `来自 ${input.company || "未知公司"} 的 ${input.contactName} (${input.contactEmail}) 提交了一份新的 PCB 报价请求。\n\n板型: ${input.pcbType} | 层数: ${input.layers ?? "未填"} | 数量: ${input.quantity ?? "未填"}\n\n附件数量: ${fileKeys.length}`,
      });
    } catch {
      // Notification failure should not block the submission
    }

    return { success: true, quoteId };
  }),

  // ── Admin endpoints ────────────────────────────────────────────────────

  /**
   * List all quote requests. Admin only.
   */
  list: adminProcedure.query(async () => {
    return listQuoteRequests();
  }),

  /**
   * Get a single quote request with files. Admin only.
   */
  get: adminProcedure.input(z.object({ id: z.number().int() })).query(async ({ input }) => {
    const quote = await getQuoteRequestById(input.id);
    if (!quote) throw new TRPCError({ code: "NOT_FOUND", message: "Quote request not found" });
    return quote;
  }),

  /**
   * Update quote status. Admin only.
   */
  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        status: z.enum(["pending", "reviewing", "quoted", "accepted", "rejected", "completed"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateQuoteStatus(input.id, input.status);
      return { success: true };
    }),
});
