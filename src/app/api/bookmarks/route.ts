import {
  createBookmark,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
  getUser,
  userHasAccess,
} from "@/db/queries"
import { z } from "zod"

const deleteBookmarksRequestSchema = z.object({
  bookmarkIds: z.array(z.string()),
})

export const POST = async (request: Request) => {
  const user = await getUser()
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const body = await request.json()
  const { title, url, dateAddedMs } = body
  const existingBookmark = await findLatestBookmarkWithUrl(user.id, url)
  if (existingBookmark) {
    return new Response(JSON.stringify(existingBookmark))
  }
  const dateAdded = new Date(dateAddedMs)
  const newBookmark = await createBookmark(user.id, title, url, dateAdded)
  return new Response(JSON.stringify(newBookmark))
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
  const hasAccess = await userHasAccess(user.id, bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await deleteBookmarks(bookmarkIds)
  return new Response(null, { status: 204 })
}
