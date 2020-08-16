import _ from 'lodash'
import { importBookmarks } from '../mongodb'

export const NUM_MAX_BOOKMARKS = 6000

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

export async function importBrowserBookmarks(report_progress) {
  let browserBookmarks = await getBookmarks(NUM_MAX_BOOKMARKS)
  const totalBookmarks = browserBookmarks.length
  let bookmarks = browserBookmarks.map(({ id, title, url, dateAdded }) => {
    return { chrome_id: id, title, url, dateAdded, tags: [] }
  })
  console.log('Starting import...')
  let importedBookmarks = 0
  // FIXME: change chunk size back to 100
  for (const chunk of _.chunk(bookmarks, 1)) {
    await importBookmarks({ chunk })
    importedBookmarks += chunk.length
    let percent = importedBookmarks / totalBookmarks
    report_progress({ percent })
    console.log(`${Math.floor(percent * 100)}%`)
  }
  console.log('...done!')
}
