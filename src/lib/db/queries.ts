import { count, eq } from "drizzle-orm"
import { auth0 } from "../auth0"
import { db } from "./drizzle"
import { bookmarkTags, users, userTags } from "./schema"

export async function getUser() {
  const session = await auth0.getSession()
  if (!session) {
    throw new Error("Session not found")
  }
  const subject = session.user.sub
  const user = await db
    .select()
    .from(users)
    .where(eq(users.auth0Sub, subject))
    .limit(1)

  if (user.length === 0) {
    return null
  }

  return user[0]
}

export async function getTagsCount() {
  const user = await getUser()
  if (!user) {
    throw new Error("Inactive user")
  }
  const tagsWithCounts = await db
    .select({
      name: userTags.displayName,
      count: count(bookmarkTags.bookmarkId),
    })
    .from(userTags)
    .innerJoin(bookmarkTags, eq(userTags.id, bookmarkTags.tagId))
    .where(eq(userTags.ownerId, user.id))
    .groupBy(userTags.id)
    .orderBy(userTags.name)

  return tagsWithCounts
}
