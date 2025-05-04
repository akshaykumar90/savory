import { withApiAuthRequired } from "@/lib/auth0"
import { addTag, getTagsCount, removeTag, userHasAccess } from "@/db/queries"
import { tagsRequestSchema } from "@/lib/schemas"

export const GET = withApiAuthRequired(async (request: Request) => {
  const tagsCount = await getTagsCount()
  return new Response(JSON.stringify(tagsCount))
})

export const POST = withApiAuthRequired(async (request: Request) => {
  const requestJson = await request.json()
  const { bookmarkIds, name } = tagsRequestSchema.parse(requestJson)
  const hasAccess = await userHasAccess(bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await addTag(bookmarkIds, name)
  return new Response(null, { status: 204 })
})

export const DELETE = withApiAuthRequired(async (request: Request) => {
  const requestJson = await request.json()
  const { bookmarkIds, name } = tagsRequestSchema.parse(requestJson)
  const hasAccess = await userHasAccess(bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await removeTag(bookmarkIds, name)
  return new Response(null, { status: 204 })
})
