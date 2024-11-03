import * as bapi from "@/lib/bapi"
import { deleteBookmarksRequestSchema } from "@/lib/schemas"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"

export const POST = withApiAuthRequired(async function POST(request: Request) {
  const body = await request.json()
  let bapiResponse = await bapi.addBookmark(body)
  return new Response(JSON.stringify(bapiResponse))
})

export const DELETE = withApiAuthRequired(async function DELETE(
  request: Request
) {
  const requestJson = await request.json()
  const deleteBookmarksRequest = deleteBookmarksRequestSchema.parse(requestJson)
  await bapi.deleteBookmarks(deleteBookmarksRequest)
  return new Response(null, { status: 204 })
})
