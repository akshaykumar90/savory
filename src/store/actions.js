import {
  fetchRecent,
  fetchTagsForBookmarkIds,
  addNewTagForBookmark
} from '../api'

export default {
  FETCH_BOOKMARKS: async ({ commit }, { num }) => {
    let recentBookmarks = await fetchRecent(num);
    const bookmarkIds = recentBookmarks.map(({ id }) => id)
    let tagsFromDb = await fetchTagsForBookmarkIds(bookmarkIds)
    for (let bookmark of recentBookmarks) {
      const result = tagsFromDb.find( tagObj => tagObj.id === bookmark.id );
      bookmark.tags = result ? result.tags : [];
    }
    commit('SET_BOOKMARKS', { items: recentBookmarks });
    commit('SET_RECENT', bookmarkIds);
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    addNewTagForBookmark({ id, tag }).then(({ tags }) => {
      commit('UPDATE_TAGS', { id, tags });
    })
  },
}
