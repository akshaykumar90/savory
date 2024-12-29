import { withApiAuthRequired } from "@/lib/auth0"
import * as bapi from "@/lib/bapi"
import { tagsRequestSchema } from "@/lib/schemas"

export const GET = withApiAuthRequired(async (request: Request) => {
  const bapiTagsCount = await bapi.getTagsCount()
  return new Response(JSON.stringify(bapiTagsCount))
})

export const POST = withApiAuthRequired(async (request: Request) => {
  const requestJson = await request.json()
  const addTagRequest = tagsRequestSchema.parse(requestJson)
  await bapi.bulkAddTag(addTagRequest)
  return new Response(null, { status: 204 })
})

export const DELETE = withApiAuthRequired(async (request: Request) => {
  const requestJson = await request.json()
  const removeTagRequest = tagsRequestSchema.parse(requestJson)
  await bapi.bulkRemoveTag(removeTagRequest)
  return new Response(null, { status: 204 })
})
