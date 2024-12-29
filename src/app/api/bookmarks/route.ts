import { withApiAuthRequired } from "@/lib/auth0"
import * as bapi from "@/lib/bapi"
import { deleteBookmarksRequestSchema } from "@/lib/schemas"

export const POST = withApiAuthRequired(async (request: Request) => {
  const body = await request.json()
  const bapiResponse = await bapi.addBookmark(body)
  return new Response(JSON.stringify(bapiResponse))
})

export const DELETE = withApiAuthRequired(async (request: Request) => {
  const body = await request.json()
  const deleteBookmarksRequest = deleteBookmarksRequestSchema.parse(body)
  await bapi.deleteBookmarks(deleteBookmarksRequest)
  return new Response(null, { status: 204 })
})
