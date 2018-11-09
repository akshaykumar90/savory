export default {
  getBookmarkById: (state) => (id) => {
    return state.bookmarks[id]
  }
}
