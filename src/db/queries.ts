import { auth0 } from "@/lib/auth0"
import type { Bookmark, BookmarksCursor, CursorType } from "@/lib/types"
import { createHash } from "crypto"
import {
  and,
  asc,
  count,
  desc,
  eq,
  gt,
  gte,
  inArray,
  isNull,
  lt,
  not,
  SQL,
  sql,
} from "drizzle-orm"
import { PgSelect } from "drizzle-orm/pg-core"
import _ from "lodash"
import { getDomain } from "tldts"
import { db } from "./drizzle"
import { bookmarks, bookmarkTags, users, userTags } from "./schema"

export async function getUser() {
  const session = await auth0.getSession()
  if (!session) {
    return null
  }
  const subject = session.user.sub
  const result = await db
    .select()
    .from(users)
    .where(eq(users.auth0Sub, subject))
    .limit(1)

  if (result.length === 0) {
    return null
  }

  const user = result[0]
  if (!user.isActive) {
    return null
  }

  return user
}

export async function createOrUpdateUser({
  auth0Sub,
  email,
  isEmailVerified,
}: {
  auth0Sub: string
  email?: string
  isEmailVerified?: boolean
}): Promise<{ userId: string; isNewUser: boolean }> {
  return await db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(users)
      .where(eq(users.auth0Sub, auth0Sub))
      .limit(1)

    const isNewUser = result.length === 0

    let userId: string

    if (isNewUser) {
      userId = crypto.randomUUID()
      await tx.insert(users).values({
        id: userId,
        auth0Sub,
        email,
        isEmailVerified,
      })
    } else {
      userId = result[0].id
      const loginCount = result[0].loginCount ?? 0
      const now = new Date()
      await tx
        .update(users)
        .set({
          email,
          isEmailVerified,
          lastLogin: now,
          loginCount: loginCount + 1,
        })

        .where(eq(users.auth0Sub, auth0Sub))
    }

    return { userId, isNewUser }
  })
}

export async function userHasAccess(userId: string, bookmarkIds: string[]) {
  const result = await db
    .select({ count: count() })
    .from(bookmarks)
    .where(
      and(eq(bookmarks.ownerId, userId), inArray(bookmarks.id, bookmarkIds))
    )

  if (result.length === 0) {
    return false
  }

  return result[0].count === bookmarkIds.length
}

export async function updateUser(userId: string, fullName: string) {
  await db.update(users).set({ fullName }).where(eq(users.id, userId))
}

export async function getTagsCount(userId: string) {
  const tagsWithCounts = await db
    .select({
      name: userTags.displayName,
      count: count(bookmarkTags.bookmarkId),
    })
    .from(userTags)
    .innerJoin(bookmarkTags, eq(userTags.id, bookmarkTags.tagId))
    .where(eq(userTags.ownerId, userId))
    .groupBy(userTags.id)
    .orderBy(userTags.name)

  return tagsWithCounts
}

export async function addTag(
  userId: string,
  bookmarkIds: string[],
  tagName: string
) {
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

  await updateSearchColumn(bookmarkIds)
}

export async function removeTag(
  userId: string,
  bookmarkIds: string[],
  tagName: string
) {
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

  await updateSearchColumn(bookmarkIds)
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

async function getTags(
  tx: any,
  bookmarkIds: string[]
): Promise<
  Array<{
    bookmarkId: string
    displayName: string
  }>
> {
  if (bookmarkIds.length === 0) {
    return []
  }

  return await tx
    .select({
      bookmarkId: bookmarks.id,
      displayName: userTags.displayName,
    })
    .from(bookmarks)
    .innerJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmarkId))
    .innerJoin(userTags, eq(userTags.id, bookmarkTags.tagId))
    .where(
      bookmarkIds.length > 1
        ? inArray(bookmarks.id, bookmarkIds)
        : eq(bookmarks.id, bookmarkIds[0])
    )
}

async function hydrateTagsForBookmarksPage(
  tx: any,
  bookmarksPage: Array<Omit<Bookmark, "tags">>
): Promise<Array<Bookmark>> {
  if (bookmarksPage.length === 0) {
    return []
  }

  const tags = await getTags(
    tx,
    bookmarksPage.map((b) => b.id)
  )

  const emptyMap: Record<string, string[]> = {}

  const tagsByBookmarkId = tags.reduce((acc, tag) => {
    if (acc[tag.bookmarkId]) {
      acc[tag.bookmarkId].push(tag.displayName)
    } else {
      acc[tag.bookmarkId] = [tag.displayName]
    }
    return acc
  }, emptyMap)

  return bookmarksPage.map((bookmark) => ({
    ...bookmark,
    tags: tagsByBookmarkId[bookmark.id] || [],
  }))
}

function getSearchColumn(
  bookmark: Omit<Bookmark, "tags"> & {
    tags?: string[]
  }
) {
  const allTags = (bookmark.tags ?? []).join(" ")
  const title = bookmark.title || ""
  const url = bookmark.url
  const site = bookmark.site || ""

  const searchString = [allTags, title, url, site].join(" ")

  return sql`to_tsvector('english', ${searchString})`
}

async function updateSearchColumn(bookmarkIds: string[]) {
  await db.transaction(async (tx) => {
    const allBookmarks = await tx
      .select({
        id: bookmarks.id,
        dateAdded: bookmarks.dateAdded,
        title: bookmarks.title,
        url: bookmarks.url,
        site: bookmarks.site,
      })
      .from(bookmarks)
      .where(inArray(bookmarks.id, bookmarkIds))

    const bookmarksWithTags = await hydrateTagsForBookmarksPage(
      tx,
      allBookmarks
    )

    for (const bookmark of bookmarksWithTags) {
      const searchColumn = getSearchColumn(bookmark)

      await tx
        .update(bookmarks)
        .set({ search: searchColumn })
        .where(eq(bookmarks.id, bookmark.id))
    }
  })
}

export async function findLatestBookmarkWithUrl(
  userId: string,
  url: string
): Promise<Bookmark | null> {
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

  const tags = (await getTags(db, [latestBookmark.id])).map(
    (tag) => tag.displayName
  )

  return {
    ...latestBookmark,
    tags,
  }
}

export async function getBookmarkById(
  userId: string,
  bookmarkId: string
): Promise<Bookmark | null> {
  const foundBookmarks = await db
    .select({
      id: bookmarks.id,
      title: bookmarks.title,
      url: bookmarks.url,
      dateAdded: bookmarks.dateAdded,
      site: bookmarks.site,
    })
    .from(bookmarks)
    .where(and(eq(bookmarks.ownerId, userId), eq(bookmarks.id, bookmarkId)))
    .limit(1)

  if (foundBookmarks.length === 0) {
    return null
  }

  const latestBookmark = foundBookmarks[0]

  const tags = (await getTags(db, [latestBookmark.id])).map(
    (tag) => tag.displayName
  )

  return {
    ...latestBookmark,
    tags,
  }
}

export async function createBookmark(
  userId: string,
  input: {
    title: string
    url: string
    dateAdded: Date
    tags: string[]
  }
): Promise<Bookmark> {
  const { title, url, dateAdded, tags } = input
  const uniqTags = _.uniq(tags)
  const lowerCaseTags = uniqTags.map((t) => t.toLowerCase())
  return await db.transaction(async (tx) => {
    const localTags = uniqTags.map((tag) => ({
      id: crypto.randomUUID(),
      name: tag.toLowerCase(),
      displayName: tag,
    }))

    const dbTags = await tx
      .select({
        id: userTags.id,
        name: userTags.name,
        displayName: userTags.displayName,
      })
      .from(userTags)
      .where(
        and(inArray(userTags.name, lowerCaseTags), eq(userTags.ownerId, userId))
      )

    // dbTags are preferred over localTags
    const finalTags = _.unionBy(dbTags, localTags, "name")

    const bookmarkId = crypto.randomUUID()

    const bookmark = {
      id: bookmarkId,
      title,
      url,
      dateAdded,
      site: getDomain(url, { allowPrivateDomains: true }),
    }

    await tx.insert(bookmarks).values({
      ...bookmark,
      ownerId: userId,
      search: getSearchColumn({ ...bookmark, tags }),
    })

    await tx
      .insert(userTags)
      .values(
        finalTags.map((tag) => ({
          ...tag,
          ownerId: userId,
        }))
      )
      .onConflictDoNothing()

    await tx
      .insert(bookmarkTags)
      .values(finalTags.map((tag) => ({ bookmarkId, tagId: tag.id })))

    return {
      ...bookmark,
      tags: uniqTags,
    }
  })
}

export async function createBookmarkWithoutTags(
  userId: string,
  title: string,
  url: string,
  dateAdded: Date
): Promise<Bookmark> {
  const bookmark = {
    id: crypto.randomUUID(),
    title,
    url,
    dateAdded,
    site: getDomain(url, { allowPrivateDomains: true }),
  }

  await db.insert(bookmarks).values({
    ...bookmark,
    ownerId: userId,
    search: getSearchColumn(bookmark),
  })

  return {
    ...bookmark,
    tags: [],
  }
}

export async function getDrillDownTags(
  userId: string,
  tags: string[],
  site?: string
) {
  const dbTags = tags.map((tag) => tag.toLowerCase())

  let sq

  if (dbTags.length > 0) {
    const filters: SQL[] = []
    filters.push(eq(userTags.ownerId, userId))

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
      .where(and(eq(bookmarks.ownerId, userId), eq(bookmarks.site, site)))
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

function buildBookmarksQuery<T extends PgSelect>(args: {
  qb: T
  userId: string
  site?: string
  tags?: string[]
  untagged?: boolean
}) {
  const { qb, userId, site, tags, untagged } = args

  if (tags && tags.length > 0 && untagged) {
    throw new Error("Cannot build bookmarks query with both tags and untagged")
  }

  let query

  const filters: SQL[] = []
  filters.push(eq(bookmarks.ownerId, userId))

  if (site) {
    filters.push(eq(bookmarks.site, site))
  }
  if (tags && tags.length > 0) {
    query = qb
      .innerJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmarkId))
      .innerJoin(userTags, eq(userTags.id, bookmarkTags.tagId))
    const dbTags = tags.map((tag) => tag.toLowerCase())
    const [first, ...rest] = dbTags
    if (!rest.length) {
      // The where clause with owner_id is needed for performance, to use the
      // `unique_owner_id_name` index on the user_tag table
      filters.push(eq(userTags.ownerId, userId))
      filters.push(eq(userTags.name, first))
    } else {
      const pgTagsArray = `{${dbTags.map((tag) => `"${tag}"`).join(",")}}`
      query = qb
        .groupBy(bookmarks.id)
        .having(sql`array_agg(${userTags.name}) @> ${pgTagsArray}::VARCHAR[]`)
    }
  } else if (untagged) {
    query = qb.leftJoin(bookmarkTags, eq(bookmarks.id, bookmarkTags.bookmarkId))
    filters.push(isNull(bookmarkTags.tagId))
  }

  return [query ?? qb, filters] as const
}

export async function getBookmarks(args: {
  userId: string
  site?: string
  tags?: string[]
  untagged?: boolean
  num?: number
  cursor?: Date
}): Promise<{
  bookmarks: Bookmark[]
  total: number
  nextCursor?: CursorType
  prevCursor?: CursorType
}> {
  const { userId, site, tags, untagged, cursor } = args

  const limit = args.num || 100

  // Bookmarks query
  const [qb, filters] = buildBookmarksQuery({
    qb: db
      .select({
        id: bookmarks.id,
        title: bookmarks.title,
        url: bookmarks.url,
        dateAdded: bookmarks.dateAdded,
        site: bookmarks.site,
      })
      .from(bookmarks)
      .$dynamic(),
    userId,
    site,
    tags,
    untagged,
  })

  const queryFilters = and(
    ...filters,
    cursor ? lt(bookmarks.dateAdded, cursor) : undefined
  )

  const limit_plus_one = limit + 1
  const query = qb
    .where(queryFilters)
    .orderBy(desc(bookmarks.dateAdded))
    .limit(limit_plus_one)

  // Bookmarks count query
  const [countQb, countFilters] = buildBookmarksQuery({
    qb: db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(bookmarks)
      .$dynamic(),
    userId,
    site,
    tags,
    untagged,
  })

  const countQuery = countQb.where(and(...countFilters))

  // Previous page cursor query
  const [previousPageQb, previousPageFilters] = buildBookmarksQuery({
    qb: db
      .select({
        dateAdded: bookmarks.dateAdded,
      })
      .from(bookmarks)
      .$dynamic(),
    userId,
    site,
    tags,
    untagged,
  })

  const previousPageQueryFilters = and(
    ...previousPageFilters,
    cursor ? gte(bookmarks.dateAdded, cursor) : undefined
  )

  const backwardQuery = cursor
    ? previousPageQb
        .where(previousPageQueryFilters)
        .orderBy(asc(bookmarks.dateAdded))
        .limit(limit)
    : Promise.resolve([])

  const [results, countResult, previousPageResults] = await Promise.all([
    query,
    countQuery,
    backwardQuery,
  ])

  const total = countResult[0].count

  const hasNextPage = results.length === limit_plus_one

  const bookmarksPage = hasNextPage ? results.slice(0, -1) : results
  const bookmarksWithTags = await hydrateTagsForBookmarksPage(db, bookmarksPage)

  const nextCursor = hasNextPage
    ? ({
        type: "bookmarks",
        cursorDate: results[limit - 1].dateAdded,
      } as const)
    : undefined

  let prevCursor: BookmarksCursor | undefined

  if (previousPageResults.length > 0) {
    const prevCursorDate = new Date(
      previousPageResults[previousPageResults.length - 1].dateAdded
    )
    prevCursorDate.setMilliseconds(prevCursorDate.getMilliseconds() + 1)
    prevCursor = {
      type: "bookmarks",
      cursorDate: prevCursorDate,
    }
  }

  return {
    bookmarks: bookmarksWithTags,
    total,
    nextCursor,
    prevCursor,
  }
}

export async function searchBookmarks(args: {
  userId: string
  query: string
  site?: string
  tags?: string[]
  untagged?: boolean
  num?: number
  cursor?: number
}): Promise<{
  bookmarks: Bookmark[]
  total: number
  nextCursor?: CursorType
  prevCursor?: CursorType
}> {
  const { userId, query, site, tags, untagged, cursor } = args

  const limit = args.num || 100

  // Search query
  const [qb, filters] = buildBookmarksQuery({
    qb: db
      .select({
        id: bookmarks.id,
        title: bookmarks.title,
        url: bookmarks.url,
        dateAdded: bookmarks.dateAdded,
        site: bookmarks.site,
      })
      .from(bookmarks)
      .$dynamic(),
    userId,
    site,
    tags,
    untagged,
  })

  const queryFilters = and(
    ...filters,
    sql`${bookmarks.search} @@ plainto_tsquery('english', ${query})`
  )

  const limit_plus_one = limit + 1
  let searchQuery = qb
    .where(queryFilters)
    .orderBy(
      sql`ts_rank(${bookmarks.search}, plainto_tsquery('english', ${query})) desc`
    )
    .limit(limit_plus_one)

  if (cursor) {
    searchQuery = searchQuery.offset(cursor)
  }

  // Count query
  const [countQb] = buildBookmarksQuery({
    qb: db
      .select({
        count: sql<number>`count(*)`.mapWith(Number),
      })
      .from(bookmarks)
      .$dynamic(),
    userId,
    site,
    tags,
    untagged,
  })

  const countQuery = countQb.where(queryFilters)

  const [results, countResult] = await Promise.all([searchQuery, countQuery])

  const total = countResult[0].count

  const hasNextPage = results.length === limit_plus_one

  const bookmarksPage = hasNextPage ? results.slice(0, -1) : results
  const bookmarksWithTags = await hydrateTagsForBookmarksPage(db, bookmarksPage)

  const nextCursor = hasNextPage
    ? ({
        type: "search",
        cursorOffset: cursor ? cursor + limit : limit,
      } as const)
    : undefined

  const prevCursor =
    cursor && cursor > 0
      ? ({
          type: "search",
          cursorOffset: cursor - limit,
        } as const)
      : undefined

  return {
    bookmarks: bookmarksWithTags,
    total,
    nextCursor,
    prevCursor,
  }
}
