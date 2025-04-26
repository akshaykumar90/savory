import * as bapi from "@/lib/bapi"
import { getDrillDownTags, getTagsCount } from "@/lib/db/queries"
import { tagsQuery } from "@/lib/queries"
import { AccessTokenError } from "@auth0/nextjs-auth0/errors"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import { Metadata } from "next"
import Image from "next/image"
import { redirect } from "next/navigation"
import emptyArt from "../../assets/reflecting.png"
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
    ...(site && { site }),
    ...(tags.length && { tags }),
    ...(cursor && { cursor }),
    ...(untagged && { untagged }),
    num: 25,
  }

  let tagsResponse, bookmarksResponse, drillDownTagsResponse

  try {
    if (query) {
      // Search page
      let arr = await Promise.all([
        getTagsCount(),
        bapi.searchBookmarks({
          ...commonArgs,
          query,
        }),
      ])
      tagsResponse = arr[0]
      bookmarksResponse = arr[1]
    } else if (tags.length || site) {
      // Tag page
      let arr = await Promise.all([
        getTagsCount(),
        bapi.getBookmarks(commonArgs),
        getDrillDownTags(tags, site),
      ])
      tagsResponse = arr[0]
      bookmarksResponse = arr[1]
      drillDownTagsResponse = arr[2]
    } else {
      // Home page
      let arr = await Promise.all([
        getTagsCount(),
        bapi.getBookmarks(commonArgs),
      ])
      tagsResponse = arr[0]
      bookmarksResponse = arr[1]
    }
  } catch (error) {
    if (error instanceof AccessTokenError) {
      redirect("/landing")
    }
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
    queryClient.setQueryData(["bookmarks", bookmark.id], bookmark)
  })

  queryClient.setQueryData(tagsQuery.queryKey, tagsResponse)

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

  const {
    has_next_page: hasNextPage,
    has_previous_page: hasPreviousPage,
    next_cursor: nextCursor,
    previous_cursor: prevCursor,
  } = bookmarksResponse.cursor_info

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <PaginationCard
          showClearFiltersButton={tags.length > 0 || !!site || !!query}
          message={message}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          nextCursor={nextCursor}
          prevCursor={prevCursor}
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
