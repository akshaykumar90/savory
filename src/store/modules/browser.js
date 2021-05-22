import { browser } from '../../api/browser'
import { getAuthWrapper } from '../../auth'

const state = () => ({
  importPercent: 0,
})

const actions = {
  IMPORT_BROWSER_BOOKMARKS: async ({ state, commit }) => {
    return new Promise((resolve, reject) => {
      const port = browser.runtime.connect(process.env.EXTENSION_ID, {
        name: 'import_bookmarks',
      })
      setTimeout(() => {
        if (state.importPercent === 0) {
          reject('No response from web extension after 10s')
        }
      }, 10000)
      port.onMessage.addListener(({ percent }) => {
        commit('UPDATE_IMPORT_PROGRESS', { percent })
        if (percent === 1.0) {
          resolve()
        }
      })
      port.postMessage({ userId: getAuthWrapper().loggedInUserId() })
    })
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
