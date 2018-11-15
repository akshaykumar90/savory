import {
  fetchRecent,
  fetchTagsForBookmarkIds,
  addNewTagForBookmark
} from '../api'

export default {
  FETCH_BOOKMARKS: ({ commit, dispatch }, { num }) => {
    fetchRecent(num)
      .then(items => dispatch({
        type: 'FETCH_TAGS_FOR_BOOKMARKS',
        bookmarks: items}))
      .then(items => {
        commit('SET_BOOKMARKS', { items });
        commit('SET_RECENT', items.map(({ id }) => id));
      })
  },

  FETCH_TAGS_FOR_BOOKMARKS: ({ commit }, { bookmarks }) => {
    const ids = bookmarks.map(({ id }) => id);
    return fetchTagsForBookmarkIds(ids).then( allTags => {
      for (let bookmark of bookmarks) {
        const result = allTags.find( tagObj => tagObj.id === bookmark.id );
        bookmark.tags = result ? result.tags : [];
      }
      return bookmarks
    })
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    addNewTagForBookmark({ id, tag }).then(({ tags }) => {
      commit('UPDATE_TAGS', { id, tags });
    })
  },
}
