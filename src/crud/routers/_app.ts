import { createTRPCRouter } from "../trpc"
import { bookmarksRouter } from "./bookmarks"
import { tagsRouter } from "./tags"

export const appRouter = createTRPCRouter({
  bookmarks: bookmarksRouter,
  tags: tagsRouter,
})

export type AppRouter = typeof appRouter
