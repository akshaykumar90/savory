import { fetchRecent } from '../api'
import { fetchTagsForBookmarkIds } from '../api'

export default {
  FETCH_BOOKMARKS: ({ commit, dispatch }, { num }) => {
    fetchRecent(num)
      .then(items => dispatch({
        type: 'FETCH_TAGS_FOR_BOOKMARKS',
        bookmarks: items}))
      .then(items => commit('SET_BOOKMARKS', { items }))
  },
  FETCH_TAGS_FOR_BOOKMARKS: ({ commit }, { bookmarks }) => {
    const ids = bookmarks.map(({ id }) => id);
    return fetchTagsForBookmarkIds(ids).then( result => {
      for (let item of bookmarks) {
        item.tags = []
      }
      return bookmarks
    })
  }
}
