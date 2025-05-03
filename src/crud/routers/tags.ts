import { addTag, getTagsCount, removeTag } from "@/lib/db/queries"
import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../trpc"

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
      // TODO: add a check to see if the user is the owner of the bookmarks
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
      // TODO: add a check to see if the user is the owner of the bookmarks
      await removeTag(bookmarkIds, name)
    }),
})
