import {
  addTag,
  getTagsCount,
  getUser,
  removeTag,
  userHasAccess,
} from "@/db/queries"
import { z } from "zod"

const tagsRequestSchema = z.object({
  bookmarkIds: z.array(z.string()),
  name: z.string(),
})

export const GET = async (request: Request) => {
  const user = await getUser()
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const tagsCount = await getTagsCount(user.id)
  return new Response(JSON.stringify(tagsCount))
}

export const POST = async (request: Request) => {
  const user = await getUser()
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const requestJson = await request.json()
  const { bookmarkIds, name } = tagsRequestSchema.parse(requestJson)
  const hasAccess = await userHasAccess(user.id, bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await addTag(user.id, bookmarkIds, name)
  return new Response(null, { status: 204 })
}

export const DELETE = async (request: Request) => {
  const user = await getUser()
  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    })
  }
  const requestJson = await request.json()
  const { bookmarkIds, name } = tagsRequestSchema.parse(requestJson)
  const hasAccess = await userHasAccess(user.id, bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await removeTag(user.id, bookmarkIds, name)
  return new Response(null, { status: 204 })
}
