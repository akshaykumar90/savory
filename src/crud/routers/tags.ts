import { addTag, getTagsCount, removeTag, userHasAccess } from "@/db/queries"
import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../trpc"
import { TRPCError } from "@trpc/server"

export const tagsRouter = createTRPCRouter({
  getTagsCount: baseProcedure.query(async () => {
    const tagsCount = await getTagsCount()
    return tagsCount
  }),
  addTag: baseProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { bookmarkIds, name } = input
      const hasAccess = await userHasAccess(bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await addTag(bookmarkIds, name)
    }),
  removeTag: baseProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
        name: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const { bookmarkIds, name } = input
      const hasAccess = await userHasAccess(bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await removeTag(bookmarkIds, name)
    }),
})
