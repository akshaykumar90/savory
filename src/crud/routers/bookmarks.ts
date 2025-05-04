import { z } from "zod"
import { baseProcedure, createTRPCRouter } from "../trpc"
import {
  createBookmark,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
  getBookmarkById,
  userHasAccess,
} from "@/db/queries"
import { TRPCError } from "@trpc/server"

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
  get: baseProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ input }) => {
      const { id: bookmarkId } = input
      return await getBookmarkById(bookmarkId)
    }),
  delete: baseProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
      })
    )
    .mutation(async ({ input }) => {
      const { bookmarkIds } = input
      const hasAccess = await userHasAccess(bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await deleteBookmarks(bookmarkIds)
    }),
})
