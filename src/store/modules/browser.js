import { importBrowserBookmarks } from '../../api/browser'

const state = () => ({
  importPercent: 0,
})

const actions = {
  IMPORT_BROWSER_BOOKMARKS: async ({ commit }) => {
    if (process.env.RUNTIME_CONTEXT === 'webapp') {
      // fixme: add a timeout reject
      return new Promise((resolve) => {
        const port = chrome.runtime.connect(process.env.EXTENSION_ID, {
          name: 'import_bookmarks',
        })
        port.onMessage.addListener(({ percent }) => {
          commit('UPDATE_IMPORT_PROGRESS', { percent })
          if (percent === 1.0) {
            resolve()
          }
        })
        port.postMessage({})
      })
    } else {
      return importBrowserBookmarks(({ percent }) =>
        commit('UPDATE_IMPORT_PROGRESS', { percent })
      )
    }
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
