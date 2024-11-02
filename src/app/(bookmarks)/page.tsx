import BookmarkRow from "./bookmark-row"
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query"
import * as bapi from "@/lib/bapi"
import PaginationCard from "./pagination-card"
import DrillDownCard from "./drill-down-card"
import { tagsQuery } from "@/lib/queries"
import { RefreshOnFocus } from "./refresh-on-focus"
import { Metadata } from "next"
import { WaitForMutations } from "./wait-for-mutations"

export async function generateMetadata({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}): Promise<Metadata> {
  let { name: urlName, site: urlSite, q: urlQuery } = searchParams

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

export default async function TagPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  let {
    name: urlName,
    site: urlSite,
    cursor: urlCursor,
    untagged: urlUntagged,
    q: urlQuery,
  } = searchParams

  const tags = !urlName ? [] : Array.isArray(urlName) ? urlName : [urlName]
  const site = Array.isArray(urlSite) ? urlSite[0] : urlSite
  const query = Array.isArray(urlQuery) ? urlQuery[0] : urlQuery
  const cursor = Array.isArray(urlCursor) ? urlCursor[0] : urlCursor
  const untagged = Array.isArray(urlUntagged)
    ? Boolean(urlUntagged[0])
    : Boolean(urlUntagged)

  const queryClient = new QueryClient()

  const commonArgs = {
    ...(site && { site }),
    ...(tags.length && { tags }),
    ...(cursor && { cursor }),
    ...(untagged && { untagged }),
    num: 25,
  }

  let tagsResponse, bookmarksResponse, drillDownTagsResponse

  if (query) {
    // Search page
    let arr = await Promise.all([
      bapi.getTagsCount(),
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
      bapi.getTagsCount(),
      bapi.getBookmarks(commonArgs),
      bapi.getDrillDownTags({ tags, site }),
    ])
    tagsResponse = arr[0]
    bookmarksResponse = arr[1]
    drillDownTagsResponse = arr[2]
  } else {
    // Home page
    let arr = await Promise.all([
      bapi.getTagsCount(),
      bapi.getBookmarks(commonArgs),
    ])
    tagsResponse = arr[0]
    bookmarksResponse = arr[1]
  }

  bookmarksResponse.bookmarks.forEach((bookmark) => {
    queryClient.setQueryData(["bookmarks", bookmark.id], bookmark)
  })

  queryClient.setQueryData(tagsQuery.queryKey, tagsResponse)

  const drillTags =
    drillDownTagsResponse?.tags_list
      // Sort the search results by decreasing tag frequency
      .sort(({ count: freq1 }, { count: freq2 }) => {
        return -(freq1 - freq2)
      })
      .map(({ name }) => name) ?? []

  const hasUntagged = drillDownTagsResponse?.has_untagged ?? false

  const numTotal = bookmarksResponse.total

  let message

  if (numTotal === 0) {
    message = "Nothing to see here"
  } else {
    const itemsStr = numTotal > 1 ? "bookmarks" : "bookmark"
    if (tags.length > 0) {
      message = `${numTotal} ${itemsStr} in ${tags.join(", ")}`
    } else if (site) {
      message = `${numTotal} ${itemsStr} in ${site}`
    } else {
      message = `${numTotal} ${itemsStr}`
    }
  }

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <div className="flex flex-col">
        <PaginationCard
          showClearFiltersButton={tags.length > 0 || !!site || !!query}
          message={message}
          nextCursor={bookmarksResponse.cursor_info.next_cursor}
          prevCursor={bookmarksResponse.cursor_info.previous_cursor}
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
