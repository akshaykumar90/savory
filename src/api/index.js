/**
 * Retrieve at most `num` recently added bookmarks
 *
 * https://developer.chrome.com/extensions/bookmarks#method-getRecent
 */
function chromeLoadBookmarks(num) {
  return new Promise((resolve) => chrome.bookmarks.getRecent(num, resolve))
}

export async function getBookmarks(num) {
  let chromeResults = await chromeLoadBookmarks(num)
  // Exclude folders
  return chromeResults.filter((b) => !!b.url)
}
