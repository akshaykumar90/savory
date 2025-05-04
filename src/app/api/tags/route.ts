import { withApiAuthRequired } from "@/lib/auth0"
import { addTag, getTagsCount, removeTag } from "@/db/queries"
import { tagsRequestSchema } from "@/lib/schemas"

export const GET = withApiAuthRequired(async (request: Request) => {
  const tagsCount = await getTagsCount()
  return new Response(JSON.stringify(tagsCount))
})

export const POST = withApiAuthRequired(async (request: Request) => {
  const requestJson = await request.json()
  const { bookmarkIds, name } = tagsRequestSchema.parse(requestJson)
  await addTag(bookmarkIds, name)
  return new Response(null, { status: 204 })
})

export const DELETE = withApiAuthRequired(async (request: Request) => {
  const requestJson = await request.json()
  const { bookmarkIds, name } = tagsRequestSchema.parse(requestJson)
  await removeTag(bookmarkIds, name)
  return new Response(null, { status: 204 })
})
