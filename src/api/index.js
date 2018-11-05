// Retrieves the recently added bookmarks
// https://developer.chrome.com/extensions/bookmarks#method-getRecent
export function fetchRecent (num) {
  return new Promise(resolve => chrome.bookmarks.getRecent(num, resolve))
}
