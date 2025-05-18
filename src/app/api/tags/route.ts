import { getSession } from "@/db/drizzle"
import { addTag, getTagsCount, removeTag } from "@/db/queries/bookmark"
import { getUser, userHasAccess } from "@/db/queries/user"
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
  const db = getSession()
  const tagsCount = await getTagsCount(db, user.id)
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
  const db = getSession()
  const hasAccess = await userHasAccess(db, user.id, bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await addTag(db, user.id, bookmarkIds, name)
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
  const db = getSession()
  const hasAccess = await userHasAccess(db, user.id, bookmarkIds)
  if (!hasAccess) {
    return new Response("Forbidden", {
      status: 403,
    })
  }
  await removeTag(db, user.id, bookmarkIds, name)
  return new Response(null, { status: 204 })
}
