import {
  createBookmarkWithoutTags,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
  getBookmarkById,
} from "@/db/queries/bookmark"
import { userHasAccess } from "@/db/queries/user"
import { TRPCError } from "@trpc/server"
import { z } from "zod"
import { createTRPCRouter, protectedProcedure } from "../trpc"

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
      const existingBookmark = await findLatestBookmarkWithUrl(
        ctx.db,
        ctx.userId,
        url
      )
      if (existingBookmark) {
        return existingBookmark
      }
      const dateAdded = new Date(dateAddedMs)
      const newBookmark = await createBookmarkWithoutTags(
        ctx.db,
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
      return await getBookmarkById(ctx.db, ctx.userId, bookmarkId)
    }),
  delete: protectedProcedure
    .input(
      z.object({
        bookmarkIds: z.array(z.string()),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { bookmarkIds } = input
      const hasAccess = await userHasAccess(ctx.db, ctx.userId, bookmarkIds)
      if (!hasAccess) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You can't touch it.",
        })
      }
      await deleteBookmarks(ctx.db, bookmarkIds)
    }),
})
