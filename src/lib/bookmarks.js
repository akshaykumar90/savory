export async function fetchBookmarks({
  site,
  tags,
  search,
  cursor,
  itemsPerPage,
}) {
  let bookmarksResponsePromise

  const commonArgs = {
    ...(site && { site }),
    ...(tags.length && { tags }),
    ...(cursor && { cursor }),
    num: itemsPerPage,
  }
  if (search !== '') {
    const args = {
      ...commonArgs,
      query: search,
    }
    bookmarksResponsePromise = ApiClient.searchBookmarks(args)
  } else {
    bookmarksResponsePromise = ApiClient.getBookmarks(commonArgs)
  }

  let bookmarks = await bookmarksResponsePromise

  let drillTags = {}

  return {
    ...bookmarks.data,
    drillTags,
    site,
    tags,
  }
}
