import { z } from "zod"
import { protectedProcedure, createTRPCRouter } from "../trpc"
import { TRPCError } from "@trpc/server"
import {
  addTag,
  getTagsCount,
  getTagsForManagement,
  getTagPreview,
  removeTag,
  renameTag,
} from "@/db/queries/bookmark"
import { userHasAccess } from "@/db/queries/user"

export const tagsRouter = createTRPCRouter({
  list: protectedProcedure.query(({ ctx }) =>
    getTagsForManagement(ctx.db, ctx.userId),
  ),
  preview: protectedProcedure
    .input(z.object({ tagId: z.string().uuid() }))
    .query(({ ctx, input }) => getTagPreview(ctx.db, ctx.userId, input.tagId)),
  renameTag: protectedProcedure
    .input(
      z.object({
        tagId: z.string().uuid(),
        name: z
          .string()
          .transform((name) => name.trim().replace(/\s+/g, " "))
          .pipe(z.string().min(1, "Enter a tag name.")),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const found = await renameTag(
          ctx.db,
          ctx.userId,
          input.tagId,
          input.name,
        )
        if (!found)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "This tag no longer exists.",
          })
        return { name: input.name }
      } catch (error) {
        const cause = error as { code?: string; cause?: { code?: string } }
        if (cause.code === "23505" || cause.cause?.code === "23505") {
          throw new TRPCError({
            code: "CONFLICT",
            message: "You already have a tag with this name.",
          })
        }
        throw error
      }
    }),
  getTagsCount: protectedProcedure.query(async ({ ctx }) => {
    return await getTagsCount(ctx.db, ctx.userId)
  }),
  addTag: protectedProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { bookmarkIds, name } = input
      const hasAccess = await userHasAccess(ctx.db, ctx.userId, bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await addTag(ctx.db, ctx.userId, bookmarkIds, name)
    }),
  removeTag: protectedProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
        name: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { bookmarkIds, name } = input
      const hasAccess = await userHasAccess(ctx.db, ctx.userId, bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await removeTag(ctx.db, ctx.userId, bookmarkIds, name)
    }),
})
