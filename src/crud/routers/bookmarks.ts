import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../trpc"
import {
  createBookmark,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
} from "@/lib/db/queries"

export const bookmarksRouter = createTRPCRouter({
  create: baseProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        dateAddedMs: z.number(),
      })
    )
    .mutation(async ({ input }) => {
      const { title, url, dateAddedMs } = input
      const existingBookmark = await findLatestBookmarkWithUrl(url)
      if (existingBookmark) {
        return existingBookmark
      }
      const dateAdded = new Date(dateAddedMs)
      const newBookmark = await createBookmark(title, url, dateAdded)
      return newBookmark
    }),
  delete: baseProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { bookmarkIds } = input
      // TODO: add a check to see if the user is the owner of the bookmarks
      await deleteBookmarks(bookmarkIds)
    }),
})
