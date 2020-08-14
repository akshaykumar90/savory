import _ from 'lodash'
import { importBookmarks } from '../../api/mongodb'
import { NUM_SYNC_BOOKMARKS } from './bookmarks'

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

const state = () => ({
  importPercent: 0,
})

const actions = {
  IMPORT_BROWSER_BOOKMARKS: async ({ commit }) => {
    let browserBookmarks = await getBookmarks(NUM_SYNC_BOOKMARKS)
    const totalBookmarks = browserBookmarks.length
    let bookmarks = browserBookmarks.map(({ id, title, url, dateAdded }) => {
      return { chrome_id: id, title, url, dateAdded, tags: [] }
    })
    console.log('Starting import...')
    let importedBookmarks = 0
    for (const chunk of _.chunk(bookmarks, 100)) {
      await importBookmarks({ chunk })
      importedBookmarks += chunk.length
      let percent = importedBookmarks / totalBookmarks
      commit('UPDATE_IMPORT_PROGRESS', { percent })
      console.log(`${Math.floor(percent * 100)}%`)
    }
    console.log('...done!')
  },
}

const mutations = {
  UPDATE_IMPORT_PROGRESS: (state, { percent }) => {
    state.importPercent = percent
  },
}

export default {
  state,
  actions,
  mutations,
}
