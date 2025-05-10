import { z } from "zod"
import { protectedProcedure, createTRPCRouter } from "../trpc"
import {
  createBookmarkWithoutTags,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
  getBookmarkById,
  userHasAccess,
} from "@/db/queries"
import { TRPCError } from "@trpc/server"

export const bookmarksRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        url: z.string(),
        dateAddedMs: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { title, url, dateAddedMs } = input
      const existingBookmark = await findLatestBookmarkWithUrl(ctx.userId, url)
      if (existingBookmark) {
        return existingBookmark
      }
      const dateAdded = new Date(dateAddedMs)
      const newBookmark = await createBookmarkWithoutTags(
        ctx.userId,
        title,
        url,
        dateAdded
      )
      return newBookmark
    }),
  get: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { id: bookmarkId } = input
      return await getBookmarkById(ctx.userId, bookmarkId)
    }),
  delete: protectedProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bookmarkIds } = input
      const hasAccess = await userHasAccess(ctx.userId, bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await deleteBookmarks(bookmarkIds)
    }),
})
