import { desc, eq } from "drizzle-orm";
import { InsertQuoteFile, InsertQuoteRequest, quoteFiles, quoteRequests } from "../drizzle/schema";
import { getDb } from "./db";

/**
 * Create a new quote request and return its ID.
 */
export async function createQuoteRequest(data: InsertQuoteRequest): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(quoteRequests).values(data);
  return Number((result as any)[0].insertId);
}

/**
 * Attach a file record to an existing quote request.
 */
export async function addQuoteFile(data: InsertQuoteFile): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(quoteFiles).values(data);
}

/**
 * List all quote requests (admin use), newest first.
 */
export async function listQuoteRequests() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.select().from(quoteRequests).orderBy(desc(quoteRequests.createdAt));
}

/**
 * Get a single quote request with its attached files.
 */
export async function getQuoteRequestById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [quote] = await db.select().from(quoteRequests).where(eq(quoteRequests.id, id)).limit(1);
  if (!quote) return null;

  const files = await db.select().from(quoteFiles).where(eq(quoteFiles.quoteId, id));
  return { ...quote, files };
}

/**
 * Update the status of a quote request (admin use).
 */
export async function updateQuoteStatus(
  id: number,
  status: "pending" | "reviewing" | "quoted" | "accepted" | "rejected" | "completed",
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.update(quoteRequests).set({ status }).where(eq(quoteRequests.id, id));
}
