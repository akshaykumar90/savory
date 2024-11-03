import * as bapi from "@/lib/bapi"
import { tagsRequestSchema } from "@/lib/schemas"
import { withApiAuthRequired } from "@auth0/nextjs-auth0"

export const GET = withApiAuthRequired(async function GET(request: Request) {
  const bapiTagsCount = await bapi.getTagsCount()
  return new Response(JSON.stringify(bapiTagsCount))
})

export const POST = withApiAuthRequired(async function POST(request: Request) {
  const requestJson = await request.json()
  const addTagRequest = tagsRequestSchema.parse(requestJson)
  await bapi.bulkAddTag(addTagRequest)
  return new Response(null, { status: 204 })
})

export const DELETE = withApiAuthRequired(async function DELETE(
  request: Request
) {
  const requestJson = await request.json()
  const removeTagRequest = tagsRequestSchema.parse(requestJson)
  await bapi.bulkRemoveTag(removeTagRequest)
  return new Response(null, { status: 204 })
})
