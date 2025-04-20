import { withApiAuthRequired } from "@/lib/auth0"
import * as bapi from "@/lib/bapi"
import { deleteBookmarks } from "@/lib/db/queries"
import { deleteBookmarksRequestSchema } from "@/lib/schemas"

export const POST = withApiAuthRequired(async (request: Request) => {
  const body = await request.json()
  const bapiResponse = await bapi.addBookmark(body)
  return new Response(JSON.stringify(bapiResponse))
})

export const DELETE = withApiAuthRequired(async (request: Request) => {
  const body = await request.json()
  const { bookmarkIds } = deleteBookmarksRequestSchema.parse(body)
  await deleteBookmarks(bookmarkIds)
  return new Response(null, { status: 204 })
})
