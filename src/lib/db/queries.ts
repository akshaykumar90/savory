import { createHash } from "crypto"
import { and, count, desc, eq, gt, inArray, not, SQL, sql } from "drizzle-orm"
import { getDomain } from "tldts"
import { auth0 } from "../auth0"
import { db } from "./drizzle"
import { bookmarks, bookmarkTags, users, userTags } from "./schema"

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
    throw new Error("Session not found")
  }

  return user[0]
}

export async function updateUser(fullName: string) {
  const user = await getUser()
  await db.update(users).set({ fullName }).where(eq(users.id, user.id))
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
      .where(
        and(
          eq(userTags.name, tagName.toLowerCase()),
          eq(userTags.ownerId, userId)
        )
      )

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
      .where(
        and(
          eq(userTags.name, tagName.toLowerCase()),
          eq(userTags.ownerId, userId)
        )
      )

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

export async function deleteBookmarks(bookmarkIds: string[]) {
  await db.transaction(async (tx) => {
    for (const bookmarkId of bookmarkIds) {
      await tx
        .delete(bookmarkTags)
        .where(eq(bookmarkTags.bookmarkId, bookmarkId))

      await tx.delete(bookmarks).where(eq(bookmarks.id, bookmarkId))
    }
  })
}

export async function findLatestBookmarkWithUrl(url: string) {
  const user = await getUser()
  if (!user) {
    throw new Error("Inactive user")
  }

  const userId = user.id
  const urlDigest = createHash("md5").update(url).digest("hex")
  let filter = eq(sql`md5(${bookmarks.url}::text)`, urlDigest)

  if (url.startsWith("https")) {
    const httpUrl = "http" + url.substring(5)
    const httpUrlDigest = createHash("md5").update(httpUrl).digest("hex")

    filter = inArray(sql`md5(${bookmarks.url}::text)`, [
      urlDigest,
      httpUrlDigest,
    ])
  }

  const foundBookmarks = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      dateAdded: bookmarks.dateAdded,
      site: bookmarks.site,
    })
    .from(bookmarks)
    .orderBy(desc(bookmarks.dateAdded))
    .where(and(eq(bookmarks.ownerId, userId), filter))

  if (foundBookmarks.length === 0) {
    return null
  }

  const latestBookmark = foundBookmarks[0]

  // Fetch tags for this bookmark
  const tags = await db
    .select({
      name: userTags.name,
      displayName: userTags.displayName,
    })
    .from(userTags)
    .innerJoin(bookmarkTags, eq(userTags.id, bookmarkTags.tagId))
    .where(eq(bookmarkTags.bookmarkId, latestBookmark.id))

  return {
    ...latestBookmark,
    tags,
  }
}

export async function createBookmark(
  title: string,
  url: string,
  dateAdded: Date
) {
  const user = await getUser()
  if (!user) {
    throw new Error("Inactive user")
  }

  const bookmark = {
    id: crypto.randomUUID(),
    title,
    url,
    dateAdded,
    site: getDomain(url, { allowPrivateDomains: true }),
  }

  await db.insert(bookmarks).values({
    ...bookmark,
    ownerId: user.id,
  })

  return bookmark
}

export async function getDrillDownTags(tags: string[], site?: string) {
  const user = await getUser()
  if (!user) {
    throw new Error("Inactive user")
  }

  const dbTags = tags.map((tag) => tag.toLowerCase())

  let sq

  if (dbTags.length > 0) {
    const filters: SQL[] = []
    filters.push(eq(userTags.ownerId, user.id))

    const pgTagsArray = `{${dbTags.map((tag) => `"${tag}"`).join(",")}}`

    let stmt = db
      .select({
        bookmarkId: bookmarkTags.bookmarkId,
      })
      .from(userTags)
      .innerJoin(bookmarkTags, eq(userTags.id, bookmarkTags.tagId))
      .groupBy(bookmarkTags.bookmarkId)
      .having(sql`array_agg(${userTags.name}) @> ${pgTagsArray}::VARCHAR[]`)

    if (site) {
      filters.push(eq(bookmarks.site, site))
      stmt = stmt.innerJoin(
        bookmarks,
        eq(bookmarks.id, bookmarkTags.bookmarkId)
      )
    }

    sq = stmt.where(and(...filters)).as("sq")
  } else if (site) {
    // Only site
    sq = db
      .select({
        bookmarkId: bookmarks.id,
      })
      .from(bookmarks)
      .where(and(eq(bookmarks.ownerId, user.id), eq(bookmarks.site, site)))
      .as("sq")
  } else {
    return []
  }

  return await db
    .select({
      displayName: userTags.displayName,
      count: count(bookmarkTags.bookmarkId),
    })
    .from(bookmarkTags)
    .innerJoin(sq, eq(bookmarkTags.bookmarkId, sq.bookmarkId))
    .innerJoin(userTags, eq(userTags.id, bookmarkTags.tagId))
    .where(dbTags.length > 0 ? not(inArray(userTags.name, dbTags)) : undefined)
    .groupBy(userTags.id)
    .having(gt(count(userTags.name), 1))
    .orderBy(userTags.name)
}
