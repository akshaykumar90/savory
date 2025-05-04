import { withApiAuthRequired } from "@/lib/auth0"
import {
  createBookmark,
  deleteBookmarks,
  findLatestBookmarkWithUrl,
} from "@/db/queries"
import { deleteBookmarksRequestSchema } from "@/lib/schemas"

export const POST = withApiAuthRequired(async (request: Request) => {
  const body = await request.json()
  const { title, url, dateAddedMs } = body
  const existingBookmark = await findLatestBookmarkWithUrl(url)
  if (existingBookmark) {
    return new Response(JSON.stringify(existingBookmark))
  }
  const dateAdded = new Date(dateAddedMs)
  const newBookmark = await createBookmark(title, url, dateAdded)
  return new Response(JSON.stringify(newBookmark))
})

export const DELETE = withApiAuthRequired(async (request: Request) => {
  const body = await request.json()
  const { bookmarkIds } = deleteBookmarksRequestSchema.parse(body)
  await deleteBookmarks(bookmarkIds)
  return new Response(null, { status: 204 })
})
