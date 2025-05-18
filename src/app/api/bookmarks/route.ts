import { getSession } from "@/db/drizzle"
import {
  createBookmarkWithoutTags,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
} from "@/db/queries/bookmark"
import { getUser, userHasAccess } from "@/db/queries/user"
import type { Bookmark } from "@/lib/types"
import { z } from "zod"

const addBookmarkRequestSchema = z.object({
  title: z.string(),
  url: z.string(),
  dateAddedMs: z.number(),
})

const deleteBookmarksRequestSchema = z.object({
  bookmarkIds: z.array(z.string()),
})

function transformBookmark(bookmark: Bookmark) {
  return {
    ...bookmark,
    date_added: bookmark.dateAdded.getTime(),
  }
}

export const POST = async (request: Request) => {
  const user = await getUser()
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()
  const { title, url, dateAddedMs } = addBookmarkRequestSchema.parse(body)
  const db = getSession()
  const existingBookmark = await findLatestBookmarkWithUrl(db, user.id, url)
  if (existingBookmark) {
    return new Response(JSON.stringify(transformBookmark(existingBookmark)))
  }
  const dateAdded = new Date(dateAddedMs)
  const newBookmark = await createBookmarkWithoutTags(
    db,
    user.id,
    title,
    url,
    dateAdded
  )
  return new Response(JSON.stringify(transformBookmark(newBookmark)))
}

export const DELETE = async (request: Request) => {
  const user = await getUser()
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()
  const { bookmarkIds } = deleteBookmarksRequestSchema.parse(body)
  const db = getSession()
  const hasAccess = await userHasAccess(db, user.id, bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await deleteBookmarks(db, bookmarkIds)
  return new Response(null, { status: 204 })
}
