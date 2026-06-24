/**
 * CRM tRPC Router
 *
 * Public:
 *   crm.submitRfq  — called by /quote and /free-sample forms
 *
 * Admin-only (adminProcedure):
 *   crm.stats
 *   crm.customers.*
 *   crm.contacts.*
 *   crm.leads.*
 *   crm.activities.*
 *   crm.rfqs.*
 *   crm.quotes.*
 *   crm.projects.*
 *   crm.invoices.*
 */

import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { notifyOwner } from "../_core/notification";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";
import {
  addProjectFile,
  addProjectLog,
  addRfqFile,
  countCustomers,
  countInvoices,
  countLeads,
  countProjects,
  countRfqs,
  createActivity,
  createContact,
  createCustomer,
  createInvoice,
  createLead,
  createProject,
  createQuote,
  createRfq,
  deleteContact,
  deleteCustomer,
  getCrmStats,
  getCustomerById,
  getInvoiceById,
  getLeadById,
  getProjectById,
  getQuoteById,
  getRfqById,
  listActivitiesByCustomer,
  listAllQuotes,
  listContactsByCustomer,
  listCustomers,
  listInvoices,
  listLeads,
  listProjectFiles,
  listProjectLogs,
  listProjects,
  listQuotesByRfq,
  listRfqFilesByRfq,
  listRfqs,
  updateContact,
  updateCustomer,
  updateInvoice,
  updateLead,
  updateProject,
  updateQuote,
  updateRfq,
} from "../crm-db";

// ─────────────────────────────────────────────────────────────────────────────
// Shared input schemas
// ─────────────────────────────────────────────────────────────────────────────

const FileAttachment = z.object({
  key: z.string(),
  url: z.string(),
  originalName: z.string(),
  mimeType: z.string().optional(),
  fileSize: z.number().optional(),
});

const UploadFileInput = z.object({
  fileName: z.string().min(1).max(512),
  mimeType: z.string().max(128).default("application/octet-stream"),
  base64: z.string(),
  fileSize: z.number().int().nonnegative().optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Customers router
// ─────────────────────────────────────────────────────────────────────────────

const customersRouter = router({
  list: adminProcedure
    .input(
      z.object({
        search: z.string().optional(),
        stage: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const [items, total] = await Promise.all([
        listCustomers(input),
        countCustomers({ search: input.search, stage: input.stage }),
      ]);
      return { items, total };
    }),

  get: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const customer = await getCustomerById(input.id);
      if (!customer) throw new TRPCError({ code: "NOT_FOUND" });
      const [contactList, leadList, activityList] = await Promise.all([
        listContactsByCustomer(input.id),
        listLeads({ customerId: input.id }),
        listActivitiesByCustomer(input.id),
      ]);
      return { customer, contacts: contactList, leads: leadList, activities: activityList };
    }),

  create: adminProcedure
    .input(
      z.object({
        companyName: z.string().min(1).max(256),
        industry: z.string().max(128).optional(),
        country: z.string().max(64).optional(),
        city: z.string().max(128).optional(),
        website: z.string().max(512).optional(),
        notes: z.string().optional(),
        stage: z.enum(["prospect", "active", "vip", "inactive", "lost"]).default("prospect"),
        assignedTo: z.number().int().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createCustomer(input);
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        companyName: z.string().min(1).max(256).optional(),
        industry: z.string().max(128).optional(),
        country: z.string().max(64).optional(),
        city: z.string().max(128).optional(),
        website: z.string().max(512).optional(),
        notes: z.string().optional(),
        stage: z.enum(["prospect", "active", "vip", "inactive", "lost"]).optional(),
        assignedTo: z.number().int().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateCustomer(id, data);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await deleteCustomer(input.id);
      return { success: true };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Contacts router
// ─────────────────────────────────────────────────────────────────────────────

const contactsRouter = router({
  listByCustomer: adminProcedure
    .input(z.object({ customerId: z.number().int() }))
    .query(async ({ input }) => listContactsByCustomer(input.customerId)),

  create: adminProcedure
    .input(
      z.object({
        customerId: z.number().int(),
        name: z.string().min(1).max(128),
        title: z.string().max(128).optional(),
        email: z.string().email().max(320).optional(),
        phone: z.string().max(64).optional(),
        wechat: z.string().max(128).optional(),
        linkedin: z.string().max(512).optional(),
        isPrimary: z.boolean().default(false),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createContact(input);
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string().min(1).max(128).optional(),
        title: z.string().max(128).optional(),
        email: z.string().email().max(320).optional(),
        phone: z.string().max(64).optional(),
        wechat: z.string().max(128).optional(),
        linkedin: z.string().max(512).optional(),
        isPrimary: z.boolean().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await updateContact(id, data);
      return { success: true };
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .mutation(async ({ input }) => {
      await deleteContact(input.id);
      return { success: true };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Leads router
// ─────────────────────────────────────────────────────────────────────────────

const leadsRouter = router({
  list: adminProcedure
    .input(
      z.object({
        customerId: z.number().int().optional(),
        status: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const [items, total] = await Promise.all([
        listLeads(input),
        countLeads({ status: input.status }),
      ]);
      return { items, total };
    }),

  get: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const lead = await getLeadById(input.id);
      if (!lead) throw new TRPCError({ code: "NOT_FOUND" });
      const rfqList = await listRfqs({ customerId: lead.customerId });
      return { lead, rfqs: rfqList.filter((r) => r.leadId === input.id) };
    }),

  create: adminProcedure
    .input(
      z.object({
        customerId: z.number().int(),
        title: z.string().min(1).max(256),
        source: z
          .enum(["website_quote", "website_sample", "referral", "email", "wechat", "linkedin", "exhibition", "cold_call", "other"])
          .default("other"),
        status: z
          .enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"])
          .default("new"),
        estimatedValue: z.number().positive().optional(),
        assignedTo: z.number().int().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const id = await createLead({
        ...input,
        estimatedValue: input.estimatedValue ? String(input.estimatedValue) : undefined,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        title: z.string().min(1).max(256).optional(),
        status: z
          .enum(["new", "contacted", "qualified", "proposal", "negotiation", "won", "lost"])
          .optional(),
        estimatedValue: z.number().positive().optional(),
        assignedTo: z.number().int().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, estimatedValue, ...rest } = input;
      await updateLead(id, {
        ...rest,
        ...(estimatedValue !== undefined ? { estimatedValue: String(estimatedValue) } : {}),
      });
      return { success: true };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Activities router
// ─────────────────────────────────────────────────────────────────────────────

const activitiesRouter = router({
  listByCustomer: adminProcedure
    .input(z.object({ customerId: z.number().int() }))
    .query(async ({ input }) => listActivitiesByCustomer(input.customerId)),

  create: adminProcedure
    .input(
      z.object({
        customerId: z.number().int(),
        leadId: z.number().int().optional(),
        type: z
          .enum(["call", "email", "meeting", "wechat", "demo", "quote_sent", "sample_sent", "follow_up", "note"])
          .default("note"),
        subject: z.string().max(256).optional(),
        description: z.string().optional(),
        performedBy: z.number().int().optional(),
        occurredAt: z.date().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await createActivity({
        ...input,
        performedBy: input.performedBy ?? ctx.user.id,
        occurredAt: input.occurredAt ?? new Date(),
      });
      return { id };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// RFQs router
// ─────────────────────────────────────────────────────────────────────────────

const rfqsRouter = router({
  list: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        customerId: z.number().int().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const [items, total] = await Promise.all([
        listRfqs(input),
        countRfqs({ status: input.status }),
      ]);
      return { items, total };
    }),

  get: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const rfq = await getRfqById(input.id);
      if (!rfq) throw new TRPCError({ code: "NOT_FOUND" });
      const [files, quoteList] = await Promise.all([
        listRfqFilesByRfq(input.id),
        listQuotesByRfq(input.id),
      ]);
      return { rfq, files, quotes: quoteList };
    }),

  updateStatus: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        status: z.enum(["pending", "reviewing", "quoted", "accepted", "rejected", "completed"]),
      })
    )
    .mutation(async ({ input }) => {
      await updateRfq(input.id, { status: input.status });
      return { success: true };
    }),

  uploadFile: adminProcedure.input(UploadFileInput).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.base64, "base64");
    const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._\-]/g, "_");
    const { key, url } = await storagePut(`rfq-files/${safeFileName}`, buffer, input.mimeType);
    return { key, url, originalName: input.fileName };
  }),

  addFile: adminProcedure
    .input(
      z.object({
        rfqId: z.number().int(),
        ...FileAttachment.shape,
      })
    )
    .mutation(async ({ input }) => {
      const { rfqId, key, url, originalName, mimeType, fileSize } = input;
      const id = await addRfqFile({
        rfqId,
        fileKey: key,
        fileUrl: url,
        originalName,
        mimeType,
        fileSize,
      });
      return { id };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Quotes router
// ─────────────────────────────────────────────────────────────────────────────

const quotesRouter = router({
  list: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => listAllQuotes(input)),

  listByRfq: adminProcedure
    .input(z.object({ rfqId: z.number().int() }))
    .query(async ({ input }) => listQuotesByRfq(input.rfqId)),

  get: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const quote = await getQuoteById(input.id);
      if (!quote) throw new TRPCError({ code: "NOT_FOUND" });
      return quote;
    }),

  create: adminProcedure
    .input(
      z.object({
        rfqId: z.number().int(),
        quoteNumber: z.string().max(64).optional(),
        unitPrice: z.number().positive().optional(),
        totalPrice: z.number().positive().optional(),
        currency: z.string().max(8).default("USD"),
        leadTimeDays: z.number().int().positive().optional(),
        validUntil: z.date().optional(),
        paymentTerms: z.string().max(256).optional(),
        deliveryTerms: z.string().max(128).optional(),
        warranty: z.string().max(256).optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).default("draft"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { unitPrice, totalPrice, ...rest } = input;
      const id = await createQuote({
        ...rest,
        unitPrice: unitPrice ? String(unitPrice) : undefined,
        totalPrice: totalPrice ? String(totalPrice) : undefined,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        quoteNumber: z.string().max(64).optional(),
        unitPrice: z.number().positive().optional(),
        totalPrice: z.number().positive().optional(),
        currency: z.string().max(8).optional(),
        leadTimeDays: z.number().int().positive().optional(),
        validUntil: z.date().optional(),
        paymentTerms: z.string().max(256).optional(),
        deliveryTerms: z.string().max(128).optional(),
        warranty: z.string().max(256).optional(),
        notes: z.string().optional(),
        status: z.enum(["draft", "sent", "accepted", "rejected", "expired"]).optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, unitPrice, totalPrice, ...rest } = input;
      await updateQuote(id, {
        ...rest,
        ...(unitPrice !== undefined ? { unitPrice: String(unitPrice) } : {}),
        ...(totalPrice !== undefined ? { totalPrice: String(totalPrice) } : {}),
      });
      return { success: true };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Projects router
// ─────────────────────────────────────────────────────────────────────────────

const projectsRouter = router({
  list: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        customerId: z.number().int().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const [items, total] = await Promise.all([
        listProjects(input),
        countProjects({ status: input.status }),
      ]);
      return { items, total };
    }),

  get: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const project = await getProjectById(input.id);
      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      const [files, logs] = await Promise.all([
        listProjectFiles(input.id),
        listProjectLogs(input.id),
      ]);
      return { project, files, logs };
    }),

  create: adminProcedure
    .input(
      z.object({
        rfqId: z.number().int(),
        customerId: z.number().int(),
        title: z.string().min(1).max(256),
        projectNumber: z.string().max(64).optional(),
        status: z
          .enum(["planning", "in_progress", "review", "on_hold", "completed", "cancelled"])
          .default("planning"),
        startDate: z.date().optional(),
        deadline: z.date().optional(),
        assignedTo: z.number().int().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await createProject(input);
      // Auto-log project creation
      await addProjectLog({
        projectId: id,
        action: "Project created",
        note: `Project "${input.title}" created with status: ${input.status}`,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        title: z.string().min(1).max(256).optional(),
        status: z
          .enum(["planning", "in_progress", "review", "on_hold", "completed", "cancelled"])
          .optional(),
        startDate: z.date().optional(),
        deadline: z.date().optional(),
        completedAt: z.date().optional(),
        assignedTo: z.number().int().optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { id, ...data } = input;
      const before = await getProjectById(id);
      await updateProject(id, data);
      // Auto-log status changes
      if (data.status && before?.status !== data.status) {
        await addProjectLog({
          projectId: id,
          action: `Status changed: ${before?.status} → ${data.status}`,
          createdBy: ctx.user.id,
        });
      }
      return { success: true };
    }),

  addLog: adminProcedure
    .input(
      z.object({
        projectId: z.number().int(),
        action: z.string().min(1).max(128),
        note: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const id = await addProjectLog({ ...input, createdBy: ctx.user.id });
      return { id };
    }),

  uploadFile: adminProcedure.input(UploadFileInput).mutation(async ({ input }) => {
    const buffer = Buffer.from(input.base64, "base64");
    const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._\-]/g, "_");
    const { key, url } = await storagePut(`project-files/${safeFileName}`, buffer, input.mimeType);
    return { key, url, originalName: input.fileName };
  }),

  addFile: adminProcedure
    .input(
      z.object({
        projectId: z.number().int(),
        category: z.string().max(64).optional(),
        ...FileAttachment.shape,
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { projectId, key, url, originalName, mimeType, fileSize, category } = input;
      const id = await addProjectFile({
        projectId,
        fileKey: key,
        fileUrl: url,
        originalName,
        mimeType,
        fileSize,
        category,
        uploadedBy: ctx.user.id,
      });
      return { id };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Invoices router
// ─────────────────────────────────────────────────────────────────────────────

const invoicesRouter = router({
  list: adminProcedure
    .input(
      z.object({
        status: z.string().optional(),
        customerId: z.number().int().optional(),
        limit: z.number().int().min(1).max(100).default(20),
        offset: z.number().int().min(0).default(0),
      })
    )
    .query(async ({ input }) => {
      const [items, total] = await Promise.all([
        listInvoices(input),
        countInvoices({ status: input.status }),
      ]);
      return { items, total };
    }),

  get: adminProcedure
    .input(z.object({ id: z.number().int() }))
    .query(async ({ input }) => {
      const invoice = await getInvoiceById(input.id);
      if (!invoice) throw new TRPCError({ code: "NOT_FOUND" });
      return invoice;
    }),

  create: adminProcedure
    .input(
      z.object({
        projectId: z.number().int(),
        customerId: z.number().int(),
        invoiceNumber: z.string().max(64).optional(),
        amount: z.number().positive(),
        currency: z.string().max(8).default("USD"),
        taxAmount: z.number().nonnegative().optional(),
        status: z.enum(["draft", "sent", "partial", "paid", "overdue", "cancelled"]).default("draft"),
        issuedAt: z.date().optional(),
        dueDate: z.date().optional(),
        paymentMethod: z.string().max(128).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { amount, taxAmount, ...rest } = input;
      const id = await createInvoice({
        ...rest,
        amount: String(amount),
        taxAmount: taxAmount !== undefined ? String(taxAmount) : undefined,
        createdBy: ctx.user.id,
      });
      return { id };
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.number().int(),
        invoiceNumber: z.string().max(64).optional(),
        amount: z.number().positive().optional(),
        currency: z.string().max(8).optional(),
        taxAmount: z.number().nonnegative().optional(),
        status: z.enum(["draft", "sent", "partial", "paid", "overdue", "cancelled"]).optional(),
        issuedAt: z.date().optional(),
        dueDate: z.date().optional(),
        paidAt: z.date().optional(),
        paymentMethod: z.string().max(128).optional(),
        notes: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, amount, taxAmount, ...rest } = input;
      await updateInvoice(id, {
        ...rest,
        ...(amount !== undefined ? { amount: String(amount) } : {}),
        ...(taxAmount !== undefined ? { taxAmount: String(taxAmount) } : {}),
      });
      return { success: true };
    }),
});

// ─────────────────────────────────────────────────────────────────────────────
// Public: Submit RFQ (called from /quote and /free-sample)
// ─────────────────────────────────────────────────────────────────────────────

const SubmitRfqInput = z.object({
  // Contact / company info
  contactName: z.string().min(1).max(128),
  contactEmail: z.string().email().max(320),
  contactPhone: z.string().max(64).optional(),
  company: z.string().max(256).optional(),

  // RFQ type
  rfqType: z.enum(["standard_quote", "free_sample"]).default("standard_quote"),

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

  // Services
  services: z.array(z.string()).optional(),
  notes: z.string().max(4000).optional(),

  // Uploaded files
  fileKeys: z
    .array(
      z.object({
        key: z.string(),
        url: z.string(),
        originalName: z.string(),
        mimeType: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .optional(),
});

// ─────────────────────────────────────────────────────────────────────────────
// Main CRM router
// ─────────────────────────────────────────────────────────────────────────────

export const crmRouter = router({
  // ── Public: submit RFQ from website forms ──────────────────────────────────
  submitRfq: publicProcedure.input(SubmitRfqInput).mutation(async ({ input }) => {
    const { fileKeys = [], services, contactName, contactEmail, contactPhone, company, rfqType, ...pcbSpecs } = input;

    // 1. Find or create customer record
    // For now, create a new prospect customer for each submission.
    // Admins can later merge duplicates in the CRM.
    const customerId = await createCustomer({
      companyName: company || contactName,
      stage: "prospect",
    });

    // 2. Create primary contact
    await createContact({
      customerId,
      name: contactName,
      email: contactEmail,
      phone: contactPhone,
      isPrimary: true,
    });

    // 3. Create lead
    const leadTitle =
      rfqType === "free_sample"
        ? `Free Sample Request — ${company || contactName}`
        : `PCB Quote Request — ${company || contactName}`;

    const leadId = await createLead({
      customerId,
      title: leadTitle,
      source: rfqType === "free_sample" ? "website_sample" : "website_quote",
      status: "new",
    });

    // 4. Create RFQ
    const rfqId = await createRfq({
      leadId,
      customerId,
      rfqType,
      ...pcbSpecs,
      boardWidth: pcbSpecs.boardWidth ? String(pcbSpecs.boardWidth) : undefined,
      boardHeight: pcbSpecs.boardHeight ? String(pcbSpecs.boardHeight) : undefined,
      boardThickness: pcbSpecs.boardThickness ? String(pcbSpecs.boardThickness) : undefined,
      services: services ? JSON.stringify(services) : undefined,
      status: "pending",
    });

    // 5. Attach files
    for (const f of fileKeys) {
      await addRfqFile({
        rfqId,
        originalName: f.originalName,
        fileKey: f.key,
        fileUrl: f.url,
        mimeType: f.mimeType,
        fileSize: f.fileSize,
      });
    }

    // 6. Notify site owner
    try {
      await notifyOwner({
        title: `新${rfqType === "free_sample" ? "免费打样" : "报价"}请求 #${rfqId} — ${contactName}`,
        content: `来自 ${company || "未知公司"} 的 ${contactName} (${contactEmail}) 提交了一份新的 PCB ${rfqType === "free_sample" ? "免费打样" : "报价"}请求。\n\n板型: ${pcbSpecs.pcbType} | 层数: ${pcbSpecs.layers ?? "未填"} | 数量: ${pcbSpecs.quantity ?? "未填"}\n\n附件数量: ${fileKeys.length}\n\nCRM 链接: /admin/crm/rfqs/${rfqId}`,
      });
    } catch {
      // Notification failure should not block submission
    }

    return { success: true, rfqId, customerId, leadId };
  }),

  // ── Admin: dashboard stats ─────────────────────────────────────────────────
  stats: adminProcedure.query(async () => getCrmStats()),

  // ── Sub-routers ────────────────────────────────────────────────────────────
  customers: customersRouter,
  contacts: contactsRouter,
  leads: leadsRouter,
  activities: activitiesRouter,
  rfqs: rfqsRouter,
  quotes: quotesRouter,
  projects: projectsRouter,
  invoices: invoicesRouter,
});
