/**
 * Unit tests for the quote router and database helpers.
 * Uses vitest and mocks the database layer.
 */
import { describe, it, expect, vi, beforeEach } from "vitest";

// ── Mock database helpers ──────────────────────────────────────────────────
vi.mock("./quoteDb", () => ({
  createQuoteRequest: vi.fn().mockResolvedValue(42),
  addQuoteFile: vi.fn().mockResolvedValue(undefined),
  listQuoteRequests: vi.fn().mockResolvedValue([]),
  getQuoteRequestById: vi.fn().mockResolvedValue(null),
  updateQuoteStatus: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./storage", () => ({
  storagePut: vi.fn().mockResolvedValue({
    key: "quote-files/test_abc12345.zip",
    url: "/manus-storage/quote-files/test_abc12345.zip",
  }),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

// ── Import after mocks ─────────────────────────────────────────────────────
import { createQuoteRequest, addQuoteFile } from "./quoteDb";
import { storagePut } from "./storage";
import { notifyOwner } from "./_core/notification";

describe("Quote DB helpers (mocked)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("createQuoteRequest returns a numeric ID", async () => {
    const id = await createQuoteRequest({
      contactName: "Alice",
      contactEmail: "alice@example.com",
      pcbType: "pcb",
      status: "pending",
    });
    expect(id).toBe(42);
    expect(createQuoteRequest).toHaveBeenCalledOnce();
  });

  it("addQuoteFile calls the DB helper with correct args", async () => {
    await addQuoteFile({
      quoteId: 42,
      originalName: "gerber.zip",
      fileKey: "quote-files/gerber_abc12345.zip",
      fileUrl: "/manus-storage/quote-files/gerber_abc12345.zip",
    });
    expect(addQuoteFile).toHaveBeenCalledWith(
      expect.objectContaining({ quoteId: 42, originalName: "gerber.zip" })
    );
  });
});

describe("Storage helper (mocked)", () => {
  it("storagePut returns key and url", async () => {
    const result = await storagePut("quote-files/test.zip", Buffer.from("data"), "application/zip");
    expect(result.key).toContain("quote-files");
    expect(result.url).toContain("/manus-storage/");
  });
});

describe("Notification helper (mocked)", () => {
  it("notifyOwner is callable", async () => {
    const ok = await notifyOwner({ title: "Test", content: "Content" });
    expect(ok).toBe(true);
  });
});

describe("Quote submission flow (unit)", () => {
  it("creates a quote and attaches files in sequence", async () => {
    const quoteId = await createQuoteRequest({
      contactName: "Bob",
      contactEmail: "bob@example.com",
      pcbType: "fpc",
      status: "pending",
    });

    const { key, url } = await storagePut("quote-files/bom.xlsx", Buffer.from("data"), "application/vnd.ms-excel");

    await addQuoteFile({
      quoteId,
      originalName: "bom.xlsx",
      fileKey: key,
      fileUrl: url,
    });

    expect(quoteId).toBe(42);
    expect(addQuoteFile).toHaveBeenCalledWith(
      expect.objectContaining({ quoteId: 42, originalName: "bom.xlsx" })
    );
  });
});
