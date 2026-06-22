import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
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

/**
 * Quote requests submitted by customers.
 * Stores PCB specifications, contact info, and current status.
 */
export const quoteRequests = mysqlTable("quote_requests", {
  id: int("id").autoincrement().primaryKey(),

  // Contact information
  contactName: varchar("contactName", { length: 128 }).notNull(),
  contactEmail: varchar("contactEmail", { length: 320 }).notNull(),
  contactPhone: varchar("contactPhone", { length: 64 }),
  company: varchar("company", { length: 256 }),

  // PCB basic specifications
  pcbType: mysqlEnum("pcbType", ["pcb", "fpc", "rigid_flex", "semi_test", "other"]).default("pcb").notNull(),
  layers: int("layers"),                       // number of layers
  quantity: int("quantity"),                   // order quantity (pcs)
  boardWidth: decimal("boardWidth", { precision: 8, scale: 2 }),   // mm
  boardHeight: decimal("boardHeight", { precision: 8, scale: 2 }),  // mm
  boardThickness: decimal("boardThickness", { precision: 6, scale: 2 }), // mm

  // Surface finish and material
  surfaceFinish: varchar("surfaceFinish", { length: 64 }),  // ENIG, HASL, OSP, etc.
  material: varchar("material", { length: 128 }),            // FR4, Rogers, etc.
  copperWeight: varchar("copperWeight", { length: 32 }),     // 1oz, 2oz, etc.

  // Services required
  services: text("services"),  // JSON array: ["schematic","layout","bom","simulation","fabrication","smt"]

  // Additional requirements
  notes: text("notes"),

  // Status management
  status: mysqlEnum("status", ["pending", "reviewing", "quoted", "accepted", "rejected", "completed"])
    .default("pending").notNull(),

  // Timestamps
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuoteRequest = typeof quoteRequests.$inferSelect;
export type InsertQuoteRequest = typeof quoteRequests.$inferInsert;

/**
 * Files attached to quote requests (Gerber, BOM, schematic, etc.)
 */
export const quoteFiles = mysqlTable("quote_files", {
  id: int("id").autoincrement().primaryKey(),
  quoteId: int("quoteId").notNull(),           // FK → quote_requests.id

  originalName: varchar("originalName", { length: 512 }).notNull(),
  fileKey: varchar("fileKey", { length: 512 }).notNull(),   // S3 storage key
  fileUrl: text("fileUrl").notNull(),                        // /manus-storage/{key}
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"),                                 // bytes

  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type QuoteFile = typeof quoteFiles.$inferSelect;
export type InsertQuoteFile = typeof quoteFiles.$inferInsert;

/**
 * Community PCB project showcase.
 * Users can upload their PCB designs for others to view, like, and comment.
 */
export const pcbProjects = mysqlTable("pcb_projects", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),              // FK → users.id

  title: varchar("title", { length: 256 }).notNull(),
  description: text("description"),
  tags: text("tags"),                           // JSON array of tag strings
  imageUrl: text("imageUrl").notNull(),         // /manus-storage/{key}
  imageKey: varchar("imageKey", { length: 512 }).notNull(),

  layers: int("layers"),                        // number of PCB layers
  software: varchar("software", { length: 128 }), // e.g. Altium Designer
  category: varchar("category", { length: 64 }), // e.g. IoT, Power, Industrial

  likesCount: int("likesCount").default(0).notNull(),
  commentsCount: int("commentsCount").default(0).notNull(),

  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PcbProject = typeof pcbProjects.$inferSelect;
export type InsertPcbProject = typeof pcbProjects.$inferInsert;

/**
 * Likes on community PCB projects (one per user per project).
 */
export const pcbLikes = mysqlTable("pcb_likes", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PcbLike = typeof pcbLikes.$inferSelect;

/**
 * Comments on community PCB projects.
 */
export const pcbComments = mysqlTable("pcb_comments", {
  id: int("id").autoincrement().primaryKey(),
  projectId: int("projectId").notNull(),
  userId: int("userId").notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PcbComment = typeof pcbComments.$inferSelect;
