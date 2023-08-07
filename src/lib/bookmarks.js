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
  // This is temporary just to disable the drill down card to appear on the bare
  // bookmarks page. We will be able to get rid of this when we launch an
  // improved desktop design for drill down.
  let hasUntagged = false

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
    // This is temporary until we augment the search backend query to return
    // this information.
    hasUntagged = true
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
    let tagsArray = Array.isArray(resp.data) ? resp.data : resp.data.tags_list
    hasUntagged = !!resp.data.has_untagged

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
    hasUntagged,
    site,
    tags,
    untagged,
  }
}
