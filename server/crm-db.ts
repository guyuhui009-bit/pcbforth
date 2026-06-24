/**
 * CRM database query helpers.
 * All functions return raw Drizzle rows — no business logic here.
 */

import { and, desc, eq, like, or, sql } from "drizzle-orm";
import { getDb } from "./db";
import {
  activities,
  contacts,
  customers,
  invoices,
  leads,
  projectFiles,
  projectLogs,
  projects,
  quotes,
  rfqFiles,
  rfqs,
  type InsertActivity,
  type InsertContact,
  type InsertCustomer,
  type InsertInvoice,
  type InsertLead,
  type InsertProject,
  type InsertProjectFile,
  type InsertProjectLog,
  type InsertQuote,
  type InsertRfq,
  type InsertRfqFile,
} from "../drizzle/schema";

// ─────────────────────────────────────────────────────────────────────────────
// Customers
// ─────────────────────────────────────────────────────────────────────────────

export async function listCustomers(opts?: { search?: string; stage?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.search) {
    conditions.push(
      or(
        like(customers.companyName, `%${opts.search}%`),
        like(customers.country, `%${opts.search}%`),
      )
    );
  }
  if (opts?.stage) {
    conditions.push(eq(customers.stage, opts.stage as any));
  }
  return db
    .select()
    .from(customers)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(customers.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function countCustomers(opts?: { search?: string; stage?: string }) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = [];
  if (opts?.search) {
    conditions.push(
      or(
        like(customers.companyName, `%${opts.search}%`),
        like(customers.country, `%${opts.search}%`),
      )
    );
  }
  if (opts?.stage) {
    conditions.push(eq(customers.stage, opts.stage as any));
  }
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(customers)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  return Number(result[0]?.count ?? 0);
}

export async function getCustomerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
  return result[0];
}

export async function createCustomer(data: InsertCustomer) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(customers).values(data);
  return result[0].insertId as number;
}

export async function updateCustomer(id: number, data: Partial<InsertCustomer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(customers).set(data).where(eq(customers.id, id));
}

export async function deleteCustomer(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(customers).where(eq(customers.id, id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Contacts
// ─────────────────────────────────────────────────────────────────────────────

export async function listContactsByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contacts).where(eq(contacts.customerId, customerId)).orderBy(desc(contacts.isPrimary));
}

export async function createContact(data: InsertContact) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(contacts).values(data);
  return result[0].insertId as number;
}

export async function updateContact(id: number, data: Partial<InsertContact>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(contacts).set(data).where(eq(contacts.id, id));
}

export async function deleteContact(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.delete(contacts).where(eq(contacts.id, id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Leads
// ─────────────────────────────────────────────────────────────────────────────

export async function listLeads(opts?: { customerId?: number; status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.customerId) conditions.push(eq(leads.customerId, opts.customerId));
  if (opts?.status) conditions.push(eq(leads.status, opts.status as any));
  return db
    .select()
    .from(leads)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(leads.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function countLeads(opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = [];
  if (opts?.status) conditions.push(eq(leads.status, opts.status as any));
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(leads)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  return Number(result[0]?.count ?? 0);
}

export async function getLeadById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(leads).where(eq(leads.id, id)).limit(1);
  return result[0];
}

export async function createLead(data: InsertLead) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(leads).values(data);
  return result[0].insertId as number;
}

export async function updateLead(id: number, data: Partial<InsertLead>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(leads).set(data).where(eq(leads.id, id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Activities
// ─────────────────────────────────────────────────────────────────────────────

export async function listActivitiesByCustomer(customerId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(activities)
    .where(eq(activities.customerId, customerId))
    .orderBy(desc(activities.occurredAt))
    .limit(50);
}

export async function createActivity(data: InsertActivity) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(activities).values(data);
  return result[0].insertId as number;
}

// ─────────────────────────────────────────────────────────────────────────────
// RFQs
// ─────────────────────────────────────────────────────────────────────────────

export async function listRfqs(opts?: { status?: string; customerId?: number; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(rfqs.status, opts.status as any));
  if (opts?.customerId) conditions.push(eq(rfqs.customerId, opts.customerId));
  return db
    .select()
    .from(rfqs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(rfqs.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function countRfqs(opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = [];
  if (opts?.status) conditions.push(eq(rfqs.status, opts.status as any));
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(rfqs)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  return Number(result[0]?.count ?? 0);
}

export async function getRfqById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(rfqs).where(eq(rfqs.id, id)).limit(1);
  return result[0];
}

export async function createRfq(data: InsertRfq) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rfqs).values(data);
  return result[0].insertId as number;
}

export async function updateRfq(id: number, data: Partial<InsertRfq>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(rfqs).set(data).where(eq(rfqs.id, id));
}

export async function listRfqFilesByRfq(rfqId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rfqFiles).where(eq(rfqFiles.rfqId, rfqId));
}

export async function addRfqFile(data: InsertRfqFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(rfqFiles).values(data);
  return result[0].insertId as number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Quotes
// ─────────────────────────────────────────────────────────────────────────────

export async function listQuotesByRfq(rfqId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(quotes).where(eq(quotes.rfqId, rfqId)).orderBy(desc(quotes.createdAt));
}

export async function listAllQuotes(opts?: { status?: string; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(quotes.status, opts.status as any));
  return db
    .select()
    .from(quotes)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(quotes.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function getQuoteById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(quotes).where(eq(quotes.id, id)).limit(1);
  return result[0];
}

export async function createQuote(data: InsertQuote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(quotes).values(data);
  return result[0].insertId as number;
}

export async function updateQuote(id: number, data: Partial<InsertQuote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(quotes).set(data).where(eq(quotes.id, id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Projects
// ─────────────────────────────────────────────────────────────────────────────

export async function listProjects(opts?: { status?: string; customerId?: number; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(projects.status, opts.status as any));
  if (opts?.customerId) conditions.push(eq(projects.customerId, opts.customerId));
  return db
    .select()
    .from(projects)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(projects.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function countProjects(opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = [];
  if (opts?.status) conditions.push(eq(projects.status, opts.status as any));
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(projects)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  return Number(result[0]?.count ?? 0);
}

export async function getProjectById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(projects).where(eq(projects.id, id)).limit(1);
  return result[0];
}

export async function createProject(data: InsertProject) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projects).values(data);
  return result[0].insertId as number;
}

export async function updateProject(id: number, data: Partial<InsertProject>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(projects).set(data).where(eq(projects.id, id));
}

export async function listProjectFiles(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(projectFiles).where(eq(projectFiles.projectId, projectId));
}

export async function addProjectFile(data: InsertProjectFile) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projectFiles).values(data);
  return result[0].insertId as number;
}

export async function listProjectLogs(projectId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(projectLogs)
    .where(eq(projectLogs.projectId, projectId))
    .orderBy(desc(projectLogs.createdAt));
}

export async function addProjectLog(data: InsertProjectLog) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(projectLogs).values(data);
  return result[0].insertId as number;
}

// ─────────────────────────────────────────────────────────────────────────────
// Invoices
// ─────────────────────────────────────────────────────────────────────────────

export async function listInvoices(opts?: { status?: string; customerId?: number; limit?: number; offset?: number }) {
  const db = await getDb();
  if (!db) return [];
  const conditions = [];
  if (opts?.status) conditions.push(eq(invoices.status, opts.status as any));
  if (opts?.customerId) conditions.push(eq(invoices.customerId, opts.customerId));
  return db
    .select()
    .from(invoices)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .orderBy(desc(invoices.createdAt))
    .limit(opts?.limit ?? 50)
    .offset(opts?.offset ?? 0);
}

export async function countInvoices(opts?: { status?: string }) {
  const db = await getDb();
  if (!db) return 0;
  const conditions = [];
  if (opts?.status) conditions.push(eq(invoices.status, opts.status as any));
  const result = await db
    .select({ count: sql<number>`count(*)` })
    .from(invoices)
    .where(conditions.length > 0 ? and(...conditions) : undefined);
  return Number(result[0]?.count ?? 0);
}

export async function getInvoiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(invoices).where(eq(invoices.id, id)).limit(1);
  return result[0];
}

export async function createInvoice(data: InsertInvoice) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(invoices).values(data);
  return result[0].insertId as number;
}

export async function updateInvoice(id: number, data: Partial<InsertInvoice>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(invoices).set(data).where(eq(invoices.id, id));
}

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard stats
// ─────────────────────────────────────────────────────────────────────────────

export async function getCrmStats() {
  const db = await getDb();
  if (!db) return { customers: 0, leads: 0, rfqs: 0, projects: 0, invoices: 0 };

  const [custCount, leadCount, rfqCount, projCount, invCount] = await Promise.all([
    db.select({ count: sql<number>`count(*)` }).from(customers),
    db.select({ count: sql<number>`count(*)` }).from(leads),
    db.select({ count: sql<number>`count(*)` }).from(rfqs),
    db.select({ count: sql<number>`count(*)` }).from(projects),
    db.select({ count: sql<number>`count(*)` }).from(invoices),
  ]);

  return {
    customers: Number(custCount[0]?.count ?? 0),
    leads: Number(leadCount[0]?.count ?? 0),
    rfqs: Number(rfqCount[0]?.count ?? 0),
    projects: Number(projCount[0]?.count ?? 0),
    invoices: Number(invCount[0]?.count ?? 0),
  };
}
