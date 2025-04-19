import { and, count, eq } from "drizzle-orm"
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

export async function addTag(bookmarkIds: string[], tagName: string) {
  const user = await getUser()
  if (!user) {
    throw new Error("Inactive user")
  }

  const userId = user.id
  await db.transaction(async (tx) => {
    let tagId = crypto.randomUUID()

    const existingTags = await tx
      .select({ id: userTags.id })
      .from(userTags)
      .where(and(eq(userTags.name, tagName), eq(userTags.ownerId, userId)))

    if (existingTags.length > 0) {
      tagId = existingTags[0].id
    } else {
      await tx.insert(userTags).values({
        id: tagId,
        name: tagName.toLowerCase(),
        displayName: tagName,
        ownerId: userId,
      })
    }

    await tx
      .insert(bookmarkTags)
      .values(bookmarkIds.map((bid) => ({ bookmarkId: bid, tagId: tagId })))
      .onConflictDoNothing({
        target: [bookmarkTags.bookmarkId, bookmarkTags.tagId],
      })
  })
}

export async function removeTag(bookmarkIds: string[], tagName: string) {
  const user = await getUser()
  if (!user) {
    throw new Error("Inactive user")
  }

  const userId = user.id
  await db.transaction(async (tx) => {
    const existingTags = await tx
      .select({ id: userTags.id })
      .from(userTags)
      .where(and(eq(userTags.name, tagName), eq(userTags.ownerId, userId)))

    if (existingTags.length === 0) {
      return
    }

    const tagId = existingTags[0].id

    for (const bookmarkId of bookmarkIds) {
      await db
        .delete(bookmarkTags)
        .where(
          and(
            eq(bookmarkTags.tagId, tagId),
            eq(bookmarkTags.bookmarkId, bookmarkId)
          )
        )
    }

    const result = await db
      .select({ count: count() })
      .from(bookmarkTags)
      .where(eq(bookmarkTags.tagId, tagId))

    if (result.length > 0 && result[0].count === 0) {
      await db.delete(userTags).where(eq(userTags.id, tagId))
    }
  })
}
