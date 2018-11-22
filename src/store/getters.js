export default {
  newBookmarks: state => {
    return state.new.slice(0, 50)
  },
  current: (state, getters) => {
    // FIXME: This makes it impossible to render a filtered view with zero
    //  results
    return state.filtered.length ? state.filtered : getters.newBookmarks
  },
  getBookmarkById: (state) => (id) => {
    return state.bookmarks[id]
  },
  getBookmarkIdsWithSite: (state) => (site) => {
    return state.new.filter(id => state.bookmarks[id].site === site)
  }
}
