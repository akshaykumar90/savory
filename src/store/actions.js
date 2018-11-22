import {
  fetchRecent,
  fetchTagsForBookmarkIds,
  fetchBookmarksWithTag,
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
  },

  ON_BOOKMARK_CREATED: ({ commit }, { bookmark }) => {
    commit('ADD_BOOKMARK', bookmark);
  },

  ON_BOOKMARK_REMOVED: ({ commit }, { bookmark }) => {
    console.log('bookmark removed!')
    console.log(bookmark)
  },

  FILTER_BY_TAG: async ({ commit }, { tagName }) => {
    if (tagName === undefined) {
      // Remove any filters, aka go to home page
      commit('CLEAR_FILTERED')
    } else {
      const cleanTagName = tagName.trim()
      let bookmarksWithTag = await fetchBookmarksWithTag(cleanTagName);
      const bookmarkIds = bookmarksWithTag.map(({ id }) => id)
      commit('SET_FILTERED', bookmarkIds);
    }
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    addNewTagForBookmark({ id, tag }).then(({ tags }) => {
      commit('UPDATE_TAGS', { id, tags });
    })
  },
}
