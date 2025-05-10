import { addTag, getTagsCount, removeTag, userHasAccess } from "@/db/queries"
import { z } from "zod"
import { protectedProcedure, createTRPCRouter } from "../trpc"
import { TRPCError } from "@trpc/server"

export const tagsRouter = createTRPCRouter({
  getTagsCount: protectedProcedure.query(async ({ ctx }) => {
    const tagsCount = await getTagsCount(ctx.userId)
    return tagsCount
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
      const hasAccess = await userHasAccess(ctx.userId, bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await addTag(ctx.userId, bookmarkIds, name)
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
      const hasAccess = await userHasAccess(ctx.userId, bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await removeTag(ctx.userId, bookmarkIds, name)
    }),
})
