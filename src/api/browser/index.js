import _ from 'lodash'
import Bowser from 'bowser'
import { importBookmarks } from '../mongodb'

export const NUM_MAX_BOOKMARKS = 6000

export const browser = window.browser || window.chrome

const browserUA = Bowser.getParser(window.navigator.userAgent)

export function isChrome() {
  return (
    browserUA.getPlatformType(true) === 'desktop' &&
    browserUA.getBrowserName(true) === 'chrome'
  )
}

export function isMobile() {
  return browserUA.getPlatformType(true) !== 'desktop'
}

export function isMacOS() {
  return browserUA.getOSName(true) === 'macos'
}

export async function isExtensionInstalled() {
  if (!browser) {
    return false
  }
  const result = await new Promise((resolve) => {
    browser.runtime.sendMessage(
      process.env.EXTENSION_ID,
      { type: 'test' },
      resolve
    )
  })
  return result === true
}

/**
 * Retrieve at most `num` recently added bookmarks
 *
 * https://developer.chrome.com/extensions/bookmarks#method-getRecent
 */
function chromeLoadBookmarks(num) {
  return new Promise((resolve) => browser.bookmarks.getRecent(num, resolve))
}

export async function getBookmarks(num) {
  let chromeResults = await chromeLoadBookmarks(num)
  // Exclude folders
  return chromeResults.filter((b) => !!b.url)
}

export async function importBrowserBookmarks(report_progress) {
  let browserBookmarks = await getBookmarks(NUM_MAX_BOOKMARKS)
  const totalBookmarks = browserBookmarks.length
  let bookmarks = browserBookmarks.map(({ title, url, dateAdded }) => {
    return {
      title,
      url,
      dateAdded,
      tags: [],
    }
  })
  console.log('Starting import...')
  let importedBookmarks = 0
  for (const chunk of _.chunk(bookmarks, 100)) {
    await importBookmarks({ chunk })
    importedBookmarks += chunk.length
    let percent = importedBookmarks / totalBookmarks
    report_progress({ percent })
    console.log(`${Math.floor(percent * 100)}%`)
  }
  console.log('...done!')
}
