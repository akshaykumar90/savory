export default {
  SET_BOOKMARKS: (state, { items }) => {
    state.bookmarks = items.map(({ id, title, url, tags }) => ({ id, title, site:url, tags }))
  }
}
