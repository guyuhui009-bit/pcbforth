import { z } from "zod";
import { and, desc, eq, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { getDb } from "../db";
import { pcbComments, pcbLikes, pcbProjects, users } from "../../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "../_core/trpc";
import { storagePut } from "../storage";

export const communityRouter = router({
  /** List projects with pagination, newest first */
  list: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(50).default(12),
        offset: z.number().min(0).default(0),
        category: z.string().optional(),
      })
    )
    .query(async ({ input }) => {
      const conditions = input.category
        ? [eq(pcbProjects.category, input.category)]
        : [];

      const db = await getDb();
      if (!db) return { projects: [], total: 0 };

      const rows = await db
        .select({
          id: pcbProjects.id,
          title: pcbProjects.title,
          description: pcbProjects.description,
          tags: pcbProjects.tags,
          imageUrl: pcbProjects.imageUrl,
          layers: pcbProjects.layers,
          software: pcbProjects.software,
          category: pcbProjects.category,
          likesCount: pcbProjects.likesCount,
          commentsCount: pcbProjects.commentsCount,
          createdAt: pcbProjects.createdAt,
          userId: pcbProjects.userId,
          userName: users.name,
        })
        .from(pcbProjects)
        .leftJoin(users, eq(pcbProjects.userId, users.id))
        .where(conditions.length ? and(...conditions) : undefined)
        .orderBy(desc(pcbProjects.createdAt))
        .limit(input.limit)
        .offset(input.offset);

      const [{ total }] = await db
        .select({ total: sql<number>`count(*)` })
        .from(pcbProjects)
        .where(conditions.length ? and(...conditions) : undefined);

      return { projects: rows, total };
    }),

  /** Get a single project with comments */
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [project] = await db
        .select({
          id: pcbProjects.id,
          title: pcbProjects.title,
          description: pcbProjects.description,
          tags: pcbProjects.tags,
          imageUrl: pcbProjects.imageUrl,
          layers: pcbProjects.layers,
          software: pcbProjects.software,
          category: pcbProjects.category,
          likesCount: pcbProjects.likesCount,
          commentsCount: pcbProjects.commentsCount,
          createdAt: pcbProjects.createdAt,
          userId: pcbProjects.userId,
          userName: users.name,
        })
        .from(pcbProjects)
        .leftJoin(users, eq(pcbProjects.userId, users.id))
        .where(eq(pcbProjects.id, input.id));

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });

      const comments = await db
        .select({
          id: pcbComments.id,
          content: pcbComments.content,
          createdAt: pcbComments.createdAt,
          userId: pcbComments.userId,
          userName: users.name,
        })
        .from(pcbComments)
        .leftJoin(users, eq(pcbComments.userId, users.id))
        .where(eq(pcbComments.projectId, input.id))
        .orderBy(desc(pcbComments.createdAt));

      return { project, comments };
    }),

  /** Upload image and create a new project */
  create: protectedProcedure
    .input(
      z.object({
        title: z.string().min(2).max(256),
        description: z.string().max(2000).optional(),
        tags: z.array(z.string()).max(10).optional(),
        layers: z.number().min(1).max(64).optional(),
        software: z.string().max(128).optional(),
        category: z.string().max(64).optional(),
        // base64 encoded image (max ~4MB after encoding)
        imageBase64: z.string(),
        imageMime: z.enum(["image/jpeg", "image/png", "image/webp", "image/gif"]),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Decode base64 and upload to storage
      const buffer = Buffer.from(input.imageBase64, "base64");
      if (buffer.byteLength > 5 * 1024 * 1024) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Image must be under 5 MB" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const ext = input.imageMime.split("/")[1];
      const key = `community/${ctx.user.id}-${Date.now()}.${ext}`;
      const { url } = await storagePut(key, buffer, input.imageMime);

      const [result] = await db.insert(pcbProjects).values({
        userId: ctx.user.id,
        title: input.title,
        description: input.description ?? null,
        tags: input.tags ? JSON.stringify(input.tags) : null,
        imageUrl: url,
        imageKey: key,
        layers: input.layers ?? null,
        software: input.software ?? null,
        category: input.category ?? null,
        likesCount: 0,
        commentsCount: 0,
      });

      return { id: (result as any).insertId as number };
    }),

  /** Delete own project */
  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [project] = await db
        .select({ userId: pcbProjects.userId })
        .from(pcbProjects)
        .where(eq(pcbProjects.id, input.id));

      if (!project) throw new TRPCError({ code: "NOT_FOUND" });
      if (project.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.delete(pcbComments).where(eq(pcbComments.projectId, input.id));
      await db.delete(pcbLikes).where(eq(pcbLikes.projectId, input.id));
      await db.delete(pcbProjects).where(eq(pcbProjects.id, input.id));
      return { success: true };
    }),

  /** Toggle like on a project */
  toggleLike: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [existing] = await db
        .select({ id: pcbLikes.id })
        .from(pcbLikes)
        .where(
          and(
            eq(pcbLikes.projectId, input.projectId),
            eq(pcbLikes.userId, ctx.user.id)
          )
        );

      if (existing) {
        // Unlike
        await db.delete(pcbLikes).where(eq(pcbLikes.id, existing.id));
        await db
          .update(pcbProjects)
          .set({ likesCount: sql`${pcbProjects.likesCount} - 1` })
          .where(eq(pcbProjects.id, input.projectId));
        return { liked: false };
      } else {
        // Like
        await db.insert(pcbLikes).values({
          projectId: input.projectId,
          userId: ctx.user.id,
        });
        await db
          .update(pcbProjects)
          .set({ likesCount: sql`${pcbProjects.likesCount} + 1` })
          .where(eq(pcbProjects.id, input.projectId));
        return { liked: true };
      }
    }),

  /** Check if current user liked a project */
  isLiked: protectedProcedure
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) return { liked: false };

      const [row] = await db
        .select({ id: pcbLikes.id })
        .from(pcbLikes)
        .where(
          and(
            eq(pcbLikes.projectId, input.projectId),
            eq(pcbLikes.userId, ctx.user.id)
          )
        );
      return { liked: !!row };
    }),

  /** Add a comment */
  addComment: protectedProcedure
    .input(
      z.object({
        projectId: z.number(),
        content: z.string().min(1).max(1000),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.insert(pcbComments).values({
        projectId: input.projectId,
        userId: ctx.user.id,
        content: input.content,
      });
      await db
        .update(pcbProjects)
        .set({ commentsCount: sql`${pcbProjects.commentsCount} + 1` })
        .where(eq(pcbProjects.id, input.projectId));
      return { success: true };
    }),

  /** Delete own comment */
  deleteComment: protectedProcedure
    .input(z.object({ commentId: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [comment] = await db
        .select({ userId: pcbComments.userId, projectId: pcbComments.projectId })
        .from(pcbComments)
        .where(eq(pcbComments.id, input.commentId));

      if (!comment) throw new TRPCError({ code: "NOT_FOUND" });
      if (comment.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.delete(pcbComments).where(eq(pcbComments.id, input.commentId));
      await db
        .update(pcbProjects)
        .set({ commentsCount: sql`${pcbProjects.commentsCount} - 1` })
        .where(eq(pcbProjects.id, comment.projectId));
      return { success: true };
    }),

  /** Get liked project IDs for current user (batch) */
  myLikes: protectedProcedure
    .input(z.object({ projectIds: z.array(z.number()) }))
    .query(async ({ input, ctx }) => {
      if (input.projectIds.length === 0) return { likedIds: [] };
      const db = await getDb();
      if (!db) return { likedIds: [] };

      const rows = await db
        .select({ projectId: pcbLikes.projectId })
        .from(pcbLikes)
        .where(
          and(
            eq(pcbLikes.userId, ctx.user.id),
            sql`${pcbLikes.projectId} IN (${sql.join(
              input.projectIds.map((id) => sql`${id}`),
              sql`, `
            )})`
          )
        );
      return { likedIds: rows.map((r: { projectId: number }) => r.projectId) };
    }),
});
