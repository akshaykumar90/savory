export async function fetchBookmarks({
  site,
  tags,
  search,
  cursor,
  untagged,
  itemsPerPage,
}) {
  let bookmarksResponsePromise
  let drillDownTagsResponsePromise

  const commonArgs = {
    ...(site && { site }),
    ...(tags.length && { tags }),
    ...(cursor && { cursor }),
    ...(untagged && { untagged }),
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
    if (tags.length > 0 || site) {
      drillDownTagsResponsePromise = ApiClient.getDrillDownTags({ tags, site })
    }
  }

  let bookmarks = await bookmarksResponsePromise

  let drillTags = {}
  if (drillDownTagsResponsePromise) {
    const resp = await drillDownTagsResponsePromise
    let tagsArray = resp.data

    // Sort the search results by decreasing tag frequency
    tagsArray.sort(({ count: freq1 }, { count: freq2 }) => {
      return -(freq1 - freq2)
    })

    for (const { name, count } of tagsArray) {
      drillTags[name] = count
    }
  }

  return {
    ...bookmarks.data,
    drillTags,
    site,
    tags,
    untagged,
  }
}
