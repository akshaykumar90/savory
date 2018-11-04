export default {
  FETCH_BOOKMARKS: ({ commit }, { num }) => {
    chrome.bookmarks.getRecent(num, items => commit('SET_BOOKMARKS', { items }))
  }
}
