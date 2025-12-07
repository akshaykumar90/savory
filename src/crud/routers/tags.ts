import { z } from "zod"
import { protectedProcedure, createTRPCRouter } from "../trpc"
import { TRPCError } from "@trpc/server"
import { addTag, getTagsCount, removeTag } from "@/db/queries/bookmark"
import { userHasAccess } from "@/db/queries/user"

export const tagsRouter = createTRPCRouter({
  getTagsCount: protectedProcedure
    .input(z.object({ format: z.enum(["object", "tuple"]).optional() }).optional())
    .query(async ({ ctx, input }) => {
      const format = input?.format ?? "object"
      if (format === "tuple") {
        return await getTagsCount(ctx.db, ctx.userId, "tuple")
      }
      return await getTagsCount(ctx.db, ctx.userId, "object")
    }),
  addTag: protectedProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
        name: z.string(),
      })
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
      })
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
