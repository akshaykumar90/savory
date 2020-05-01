/**
 * Find BookmarkTreeNodes matching the given `query`
 *
 * https://developer.chrome.com/extensions/bookmarks#method-search
 */
function chromeBookmarksSearch (query) {
  return new Promise(resolve => chrome.bookmarks.search(query, resolve))
}

/**
 * Retrieve at most `num` recently added bookmarks
 *
 * https://developer.chrome.com/extensions/bookmarks#method-getRecent
 */
function chromeLoadBookmarks (num) {
  return new Promise(resolve => chrome.bookmarks.getRecent(num, resolve))
}

export async function searchBookmarks (query) {
  let chromeResults = await chromeBookmarksSearch(query)
  // Exclude folders
  return chromeResults.filter(b => !!b.url).map(({ id }) => id)
}

export async function getBookmarks (num) {
  let chromeResults = await chromeLoadBookmarks(num)
  // Exclude folders
  return chromeResults.filter(b => !!b.url)
}
