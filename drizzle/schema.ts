import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  boolean,
} from "drizzle-orm/mysql-core";

// ─────────────────────────────────────────────────────────────────────────────
// Core: Users (auth)
// ─────────────────────────────────────────────────────────────────────────────

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Customers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Company / organization record.
 * A Customer is the top-level entity in the CRM hierarchy.
 */
export const customers = mysqlTable("customers", {
  id: int("id").autoincrement().primaryKey(),

  companyName: varchar("companyName", { length: 256 }).notNull(),
  industry: varchar("industry", { length: 128 }),   // e.g. Consumer Electronics, Industrial
  country: varchar("country", { length: 64 }),
  city: varchar("city", { length: 128 }),
  website: varchar("website", { length: 512 }),
  notes: text("notes"),

  // Lifecycle stage
  stage: mysqlEnum("stage", ["prospect", "active", "vip", "inactive", "lost"])
    .default("prospect").notNull(),

  // Assigned sales rep (FK → users.id)
  assignedTo: int("assignedTo"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Contacts
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Individual person at a customer company.
 */
export const contacts = mysqlTable("contacts", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),   // FK → customers.id

  name: varchar("name", { length: 128 }).notNull(),
  title: varchar("title", { length: 128 }),  // job title
  email: varchar("email", { length: 320 }),
  phone: varchar("phone", { length: 64 }),
  wechat: varchar("wechat", { length: 128 }),
  linkedin: varchar("linkedin", { length: 512 }),
  isPrimary: boolean("isPrimary").default(false).notNull(),
  notes: text("notes"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Contact = typeof contacts.$inferSelect;
export type InsertContact = typeof contacts.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Leads
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A sales opportunity / lead associated with a customer.
 * A lead can have one or more RFQs.
 */
export const leads = mysqlTable("leads", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),   // FK → customers.id

  title: varchar("title", { length: 256 }).notNull(),  // short description of the opportunity

  source: mysqlEnum("source", [
    "website_quote",   // /quote form
    "website_sample",  // /free-sample form
    "referral",
    "email",
    "wechat",
    "linkedin",
    "exhibition",
    "cold_call",
    "other",
  ]).default("website_quote").notNull(),

  status: mysqlEnum("status", [
    "new",
    "contacted",
    "qualified",
    "proposal",
    "negotiation",
    "won",
    "lost",
  ]).default("new").notNull(),

  // Estimated deal value (USD)
  estimatedValue: decimal("estimatedValue", { precision: 12, scale: 2 }),

  // Assigned sales rep (FK → users.id)
  assignedTo: int("assignedTo"),

  notes: text("notes"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Activities
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Timeline of interactions with a customer (calls, emails, meetings, etc.)
 */
export const activities = mysqlTable("activities", {
  id: int("id").autoincrement().primaryKey(),
  customerId: int("customerId").notNull(),   // FK → customers.id
  leadId: int("leadId"),                     // optional FK → leads.id

  type: mysqlEnum("type", [
    "call",
    "email",
    "meeting",
    "wechat",
    "demo",
    "quote_sent",
    "sample_sent",
    "follow_up",
    "note",
  ]).default("note").notNull(),

  subject: varchar("subject", { length: 256 }),
  description: text("description"),

  // Who performed this activity (FK → users.id)
  performedBy: int("performedBy"),

  occurredAt: timestamp("occurredAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = typeof activities.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: RFQs (Request for Quotation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A specific PCB request for quotation, linked to a lead.
 * This is the central technical document in the pipeline.
 */
export const rfqs = mysqlTable("rfqs", {
  id: int("id").autoincrement().primaryKey(),
  leadId: int("leadId").notNull(),           // FK → leads.id
  customerId: int("customerId").notNull(),   // denormalized for easy queries

  // RFQ type
  rfqType: mysqlEnum("rfqType", ["standard_quote", "free_sample"])
    .default("standard_quote").notNull(),

  // PCB specifications
  pcbType: mysqlEnum("pcbType", ["pcb", "fpc", "rigid_flex", "semi_test", "other"])
    .default("pcb").notNull(),
  layers: int("layers"),
  quantity: int("quantity"),
  boardWidth: decimal("boardWidth", { precision: 8, scale: 2 }),
  boardHeight: decimal("boardHeight", { precision: 8, scale: 2 }),
  boardThickness: decimal("boardThickness", { precision: 6, scale: 2 }),
  surfaceFinish: varchar("surfaceFinish", { length: 64 }),
  material: varchar("material", { length: 128 }),
  copperWeight: varchar("copperWeight", { length: 32 }),

  // Services requested (JSON array)
  services: text("services"),

  notes: text("notes"),

  status: mysqlEnum("status", [
    "pending",     // just submitted
    "reviewing",   // being reviewed by team
    "quoted",      // quote sent to customer
    "accepted",    // customer accepted quote
    "rejected",    // customer rejected
    "completed",   // project completed
  ]).default("pending").notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Rfq = typeof rfqs.$inferSelect;
export type InsertRfq = typeof rfqs.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: RFQ Files
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Files attached to an RFQ (Gerber, BOM, schematic, etc.)
 */
export const rfqFiles = mysqlTable("rfq_files", {
  id: int("id").autoincrement().primaryKey(),
  rfqId: int("rfqId").notNull(),            // FK → rfqs.id

  originalName: varchar("originalName", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type RfqFile = typeof rfqFiles.$inferSelect;
export type InsertRfqFile = typeof rfqFiles.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Quotes (Formal Quotation)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * A formal price quotation sent to the customer in response to an RFQ.
 */
export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  rfqId: int("rfqId").notNull(),            // FK → rfqs.id

  quoteNumber: varchar("quoteNumber", { length: 64 }),  // e.g. "Q-2024-001"

  // Pricing
  unitPrice: decimal("unitPrice", { precision: 12, scale: 2 }),
  totalPrice: decimal("totalPrice", { precision: 12, scale: 2 }),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),

  // Lead time
  leadTimeDays: int("leadTimeDays"),

  // Validity
  validUntil: timestamp("validUntil"),

  // Terms and conditions
  paymentTerms: varchar("paymentTerms", { length: 256 }),  // e.g. "30% deposit, 70% before shipment"
  deliveryTerms: varchar("deliveryTerms", { length: 128 }), // e.g. "FOB Shenzhen"
  warranty: varchar("warranty", { length: 256 }),

  notes: text("notes"),

  status: mysqlEnum("status", [
    "draft",
    "sent",
    "accepted",
    "rejected",
    "expired",
  ]).default("draft").notNull(),

  // Who created this quote (FK → users.id)
  createdBy: int("createdBy"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Projects
// ─────────────────────────────────────────────────────────────────────────────

/**
 * An active production/design project, created when a quote is accepted.
 */
export const projects = mysqlTable("projects", {
  id: int("id").autoincrement().primaryKey(),
  rfqId: int("rfqId").notNull(),            // FK → rfqs.id
  customerId: int("customerId").notNull(),  // denormalized

  projectNumber: varchar("projectNumber", { length: 64 }),  // e.g. "P-2024-001"
  title: varchar("title", { length: 256 }).notNull(),

  status: mysqlEnum("status", [
    "planning",
    "in_progress",
    "review",
    "on_hold",
    "completed",
    "cancelled",
  ]).default("planning").notNull(),

  startDate: timestamp("startDate"),
  deadline: timestamp("deadline"),
  completedAt: timestamp("completedAt"),

  // Assigned engineer (FK → users.id)
  assignedTo: int("assignedTo"),

  notes: text("notes"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Project = typeof projects.$inferSelect;
export type InsertProject = typeof projects.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Project Files
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Files associated with a project (design outputs, reports, etc.)
 */
export const projectFiles = mysqlTable("project_files", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),    // FK → projects.id

  originalName: varchar("originalName", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"),
  category: varchar("category", { length: 64 }), // e.g. "gerber", "bom", "report", "photo"

  uploadedBy: int("uploadedBy"),            // FK → users.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectFile = typeof projectFiles.$inferSelect;
export type InsertProjectFile = typeof projectFiles.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Project Logs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Audit trail / progress log entries for a project.
 */
export const projectLogs = mysqlTable("project_logs", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),    // FK → projects.id

  action: varchar("action", { length: 128 }).notNull(),  // e.g. "Status changed to in_progress"
  note: text("note"),

  // Who made this log entry (FK → users.id)
  createdBy: int("createdBy"),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ProjectLog = typeof projectLogs.$inferSelect;
export type InsertProjectLog = typeof projectLogs.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// CRM: Invoices
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Invoice issued for a project.
 */
export const invoices = mysqlTable("invoices", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),    // FK → projects.id
  customerId: int("customerId").notNull(),  // denormalized

  invoiceNumber: varchar("invoiceNumber", { length: 64 }),  // e.g. "INV-2024-001"

  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  currency: varchar("currency", { length: 8 }).default("USD").notNull(),
  taxAmount: decimal("taxAmount", { precision: 12, scale: 2 }),

  status: mysqlEnum("status", [
    "draft",
    "sent",
    "partial",   // partially paid
    "paid",
    "overdue",
    "cancelled",
  ]).default("draft").notNull(),

  issuedAt: timestamp("issuedAt"),
  dueDate: timestamp("dueDate"),
  paidAt: timestamp("paidAt"),

  paymentMethod: varchar("paymentMethod", { length: 128 }),
  notes: text("notes"),

  createdBy: int("createdBy"),              // FK → users.id
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Invoice = typeof invoices.$inferSelect;
export type InsertInvoice = typeof invoices.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// Legacy: Quote Requests (kept for backward compatibility)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @deprecated Use rfqs + leads + customers instead.
 * Kept for backward compatibility with existing form submissions.
 */
export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),
  contactName: varchar("contactName", { length: 128 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 64 }),
  company: varchar("company", { length: 256 }),
  pcbType: mysqlEnum("pcbType", ["pcb", "fpc", "rigid_flex", "semi_test", "other"]).default("pcb").notNull(),
  layers: int("layers"),
  quantity: int("quantity"),
  boardWidth: decimal("boardWidth", { precision: 8, scale: 2 }),
  boardHeight: decimal("boardHeight", { precision: 8, scale: 2 }),
  boardThickness: decimal("boardThickness", { precision: 6, scale: 2 }),
  surfaceFinish: varchar("surfaceFinish", { length: 64 }),
  material: varchar("material", { length: 128 }),
  copperWeight: varchar("copperWeight", { length: 32 }),
  services: text("services"),
  notes: text("notes"),
  status: mysqlEnum("status", ["pending", "reviewing", "quoted", "accepted", "rejected", "completed"])
    .default("pending").notNull(),
  // Link to new CRM entities (populated after migration)
  rfqId: int("rfqId"),                      // FK → rfqs.id (nullable, set after CRM migration)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

/**
 * Files attached to legacy quote requests.
 */
export const quoteFiles = mysqlTable("quote_files", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull(),
  originalName: varchar("originalName", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),
  fileUrl: text("fileUrl").notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuoteFile = typeof quoteFiles.$inferSelect;
export type InsertQuoteFile = typeof quoteFiles.$inferInsert;

// ─────────────────────────────────────────────────────────────────────────────
// Community: PCB Projects Showcase
// ─────────────────────────────────────────────────────────────────────────────

export const pcbProjects = mysqlTable("pcb_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  tags: text("tags"),
  imageUrl: text("imageUrl").notNull(),
  imageKey: varchar("imageKey", { length: 512 }).notNull(),
  layers: int("layers"),
  software: varchar("software", { length: 128 }),
  category: varchar("category", { length: 64 }),
  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PcbProject = typeof pcbProjects.$inferSelect;
export type InsertPcbProject = typeof pcbProjects.$inferInsert;

export const pcbLikes = mysqlTable("pcb_likes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PcbLike = typeof pcbLikes.$inferSelect;

export const pcbComments = mysqlTable("pcb_comments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PcbComment = typeof pcbComments.$inferSelect;
