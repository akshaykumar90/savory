export default {
  SET_BOOKMARKS: (state, { items }) => {
    state.bookmarks = items.map(({ id, title, url }) => ({ id, title, site:url }))
  }
}
