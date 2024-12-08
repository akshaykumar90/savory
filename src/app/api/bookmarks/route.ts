import * as bapi from "@/lib/bapi"
import { deleteBookmarksRequestSchema } from "@/lib/schemas"

export async function POST(request: Request) {
  const body = await request.json()
  let bapiResponse = await bapi.addBookmark(body)
  return new Response(JSON.stringify(bapiResponse))
}

export async function DELETE(request: Request) {
  const requestJson = await request.json()
  const deleteBookmarksRequest = deleteBookmarksRequestSchema.parse(requestJson)
  await bapi.deleteBookmarks(deleteBookmarksRequest)
  return new Response(null, { status: 204 })
}
