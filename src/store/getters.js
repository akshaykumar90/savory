export default {
  newBookmarks: state => {
    return state.new.slice(0, 50)
  },
  current: (state, getters) => {
    return state.filtered.length ? state.filtered : getters.newBookmarks
  },
  getBookmarkById: (state) => (id) => {
    return state.bookmarks[id]
  }
}
