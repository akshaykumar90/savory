import { getSession } from "@/db/drizzle"
import {
  getBookmarks,
  getDrillDownTags,
  getTagsCount,
  searchBookmarks,
} from "@/db/queries/bookmark"
import { getUser } from "@/db/queries/user"
import type { CursorType } from "@/lib/types"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import emptyArt from "../../assets/reflecting.png"
import { trpc } from "../trpc-server"
import BookmarkRow from "./bookmark-row"
import DrillDownCard from "./drill-down-card"
import ErrorScreen from "./error-screen"
import PaginationCard from "./pagination-card"
import { RefreshOnFocus } from "./refresh-on-focus"
import { WaitForMutations } from "./wait-for-mutations"

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParams
}): Promise<Metadata> {
  let { name: urlName, site: urlSite, q: urlQuery } = await searchParams

  const tags = !urlName ? [] : Array.isArray(urlName) ? urlName : [urlName]
  const site = Array.isArray(urlSite) ? urlSite[0] : urlSite
  const filters = [site, ...tags].filter((x) => !!x)

  const query = Array.isArray(urlQuery) ? urlQuery[0] : urlQuery

  const titleArray = []

  if (query) {
    titleArray.push(`Search results for ${query}`)
  }

  if (filters.length) {
    titleArray.push(filters.join(", "))
  }

  const titlePrefix = titleArray.join(" in ")

  let title = "Savory"
  if (titlePrefix) {
    title = `${titlePrefix} – ${title}`
  }

  return {
    title,
  }
}

function EmptyState({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <div className="py-16 px-4 text-center sm:px-6 lg:px-8">
      <Image
        className="mx-auto w-3/4 opacity-75 sm:w-1/2"
        src={emptyArt}
        alt=""
        width="400"
        height="326"
      />
      <h3 className="mt-10 text-sm font-medium text-gray-900">{title}</h3>
      <p className="mt-1 text-sm text-gray-500">{children}</p>
    </div>
  )
}

function EmptyReading() {
  return (
    <EmptyState title="Your reading list is empty.">
      Add the &quot;reading&quot; tag to any saved item and it will show up
      here!
    </EmptyState>
  )
}

function EmptyPlaylist() {
  return (
    <EmptyState title="Your playlist is empty.">
      Add the &quot;playlist&quot; tag to any saved item and it will show up
      here!
    </EmptyState>
  )
}

export default async function TagPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  let {
    name: urlName,
    site: urlSite,
    cursor: urlCursor,
    untagged: urlUntagged,
    q: urlQuery,
  } = await searchParams

  const tags = !urlName ? [] : Array.isArray(urlName) ? urlName : [urlName]
  const site = Array.isArray(urlSite) ? urlSite[0] : urlSite
  const query = Array.isArray(urlQuery) ? urlQuery[0] : urlQuery
  const cursor = Array.isArray(urlCursor) ? urlCursor[0] : urlCursor
  const untagged = Array.isArray(urlUntagged)
    ? Boolean(urlUntagged[0])
    : Boolean(urlUntagged)

  const db = await getSession()
  const user = await getUser(db)
  if (!user) {
    redirect("/landing")
  }

  const routeHasOneTag = (name: string) => {
    if (site || query || cursor) {
      return false
    }
    if (tags.length === 0 || tags.length > 1) {
      return false
    }
    return tags[0].toLowerCase() === name
  }

  const queryClient = new QueryClient()

  const commonArgs = {
    userId: user.id,
    num: 25,
    ...(site && { site }),
    ...(tags.length && { tags }),
    ...(untagged && { untagged }),
  }

  let tagsResponse, bookmarksResponse, drillDownTagsResponse

  try {
    if (query) {
      // Search page
      let searchCursor: number | undefined
      if (cursor) {
        const numOffsetString = Buffer.from(cursor, "base64").toString("utf-8")
        searchCursor = parseInt(numOffsetString)
      }
      let arr = await Promise.all([
        getTagsCount(db, user.id),
        searchBookmarks(db, {
          ...commonArgs,
          query,
          cursor: searchCursor,
        }),
        getDrillDownTags(db, user.id, tags, site),
      ])
      tagsResponse = arr[0]
      bookmarksResponse = arr[1]
    } else if (tags.length || site) {
      // Tag page
      let bookmarksCursor: Date | undefined
      if (cursor) {
        const dateMsString = Buffer.from(cursor, "base64").toString("utf-8")
        bookmarksCursor = new Date(parseInt(dateMsString))
      }
      let arr = await Promise.all([
        getTagsCount(db, user.id),
        getBookmarks(db, {
          ...commonArgs,
          cursor: bookmarksCursor,
        }),
        getDrillDownTags(db, user.id, tags, site),
      ])
      tagsResponse = arr[0]
      bookmarksResponse = arr[1]
      drillDownTagsResponse = arr[2]
    } else {
      // Home page
      let bookmarksCursor: Date | undefined
      if (cursor) {
        const dateMsString = Buffer.from(cursor, "base64").toString("utf-8")
        bookmarksCursor = new Date(parseInt(dateMsString))
      }
      let arr = await Promise.all([
        getTagsCount(db, user.id),
        getBookmarks(db, {
          ...commonArgs,
          cursor: bookmarksCursor,
        }),
      ])
      tagsResponse = arr[0]
      bookmarksResponse = arr[1]
    }
  } catch (error) {
    const wrappedError =
      error instanceof Error ? error : new Error(JSON.stringify(error))
    return <ErrorScreen error={wrappedError} />
  }

  if (bookmarksResponse.total === 0) {
    // Special empty states
    if (routeHasOneTag("reading")) {
      return <EmptyReading />
    } else if (routeHasOneTag("playlist")) {
      return <EmptyPlaylist />
    }
  }

  bookmarksResponse.bookmarks.forEach((bookmark) => {
    queryClient.setQueryData(
      trpc.bookmarks.get.queryKey({ id: bookmark.id }),
      bookmark
    )
  })

  queryClient.setQueryData(trpc.tags.getTagsCount.queryKey(), tagsResponse)

  const drillTags = (drillDownTagsResponse ?? [])
    // Sort the search results by decreasing tag frequency
    .sort(({ count: freq1 }, { count: freq2 }) => {
      return -(freq1 - freq2)
    })
    .map((tag) => tag.displayName)

  const numTotal = bookmarksResponse.total

  let message: string
  let hasUntagged = false

  if (numTotal === 0) {
    message = "Nothing to see here"
  } else {
    const itemsStr = numTotal > 1 ? "bookmarks" : "bookmark"
    if (tags.length > 0) {
      message = `${numTotal} ${itemsStr} in ${tags.join(", ")}`
    } else if (site) {
      message = `${numTotal} ${itemsStr} in ${site}`
      hasUntagged = true
    } else {
      message = `${numTotal} ${itemsStr}`
    }
  }

  const { nextCursor, prevCursor } = bookmarksResponse

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <PaginationCard
          showClearFiltersButton={tags.length > 0 || !!site || !!query}
          message={message}
          nextCursor={nextCursor && encodeCursor(nextCursor)}
          prevCursor={prevCursor && encodeCursor(prevCursor)}
        />
        {(drillTags.length > 0 || hasUntagged) && (
          <DrillDownCard tags={drillTags} showUntagged={hasUntagged} />
        )}
        <ul className="flex flex-col">
          {bookmarksResponse.bookmarks.map((bookmark) => (
            <BookmarkRow key={bookmark.id} bookmarkId={bookmark.id} />
          ))}
        </ul>
      </div>
      <RefreshOnFocus />
      <WaitForMutations />
    </HydrationBoundary>
  )
}

function encodeCursor(cursor: CursorType) {
  if (cursor.type === "bookmarks") {
    const buffer = Buffer.from(cursor.cursorDate.valueOf().toString(), "utf-8")
    return buffer.toString("base64")
  } else if (cursor.type === "search") {
    const buffer = Buffer.from(cursor.cursorOffset.toString(), "utf-8")
    return buffer.toString("base64")
  }
}
