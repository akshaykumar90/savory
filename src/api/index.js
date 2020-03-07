function chromeBookmarksSearch (query) {
  // Find BookmarkTreeNodes matching the given query
  // https://developer.chrome.com/extensions/bookmarks#method-search
  return new Promise(resolve => chrome.bookmarks.search(query, resolve))
}

export async function searchBookmarks (query) {
  let chromeResults = await chromeBookmarksSearch(query)
  const bookmarkIds = chromeResults
    .filter(node => node.hasOwnProperty('url'))
    .map(({ id }) => id)
  return bookmarkIds
}
