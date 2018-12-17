import {
  fetchRecent,
  fetchTagsForBookmarkIds,
  fetchBookmarksWithTag,
  addNewTagForBookmark,
  deleteBookmarkTags,
  searchBookmarks
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

  LOAD_MORE_BOOKMARKS: ({ commit }) => {
    return new Promise(resolve => {
      // The setTimeout simulates async remote api call to load more content
      setTimeout(() => {
        commit('INCR_PAGE')
        resolve()
      }, 100)
    })
  },

  ON_BOOKMARK_CREATED: ({ commit }, { bookmark }) => {
    commit('ADD_BOOKMARK', bookmark);
  },

  ON_BOOKMARK_REMOVED: async ({ commit }, { bookmark }) => {
    await deleteBookmarkTags(bookmark)
    commit('REMOVE_BOOKMARK', bookmark);
  },

  ON_ROUTE_CHANGE: async ({ commit, getters }, { params }) => {
    if (params.hasOwnProperty('site')) {
      // Filter bookmarks by domain name
      let site = params.site.trim()
      const bookmarkIds = getters.getBookmarkIdsWithSite(site)
      commit('SET_FILTERED', bookmarkIds);
      commit('SET_SEARCH_FILTERS', [site]);
    } else if (params.hasOwnProperty('tag')) {
      // Filter bookmarks by tag
      let tag = params.tag.trim()
      let bookmarksWithTag = await fetchBookmarksWithTag(tag);
      const bookmarkIds = bookmarksWithTag.map(({ id }) => id)
      commit('SET_FILTERED', bookmarkIds);
      commit('SET_SEARCH_FILTERS', [tag]);
    } else if (params.hasOwnProperty('query')) {
      // Search query
      let query = params.query.trim()
      let searchResults = await searchBookmarks(query);
      const bookmarkIds = searchResults
        .filter(node => node.hasOwnProperty('url'))
        .map(({ id }) => id)
      commit('SET_FILTERED', bookmarkIds);
      // Search resets any existing filters
      commit('SET_SEARCH_FILTERS', []);
    } else {
      // Remove any filters, aka go to home page
      commit('CLEAR_FILTERED')
      commit('SET_SEARCH_FILTERS', []);
    }
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    addNewTagForBookmark({ id, tag }).then(({ tags }) => {
      commit('UPDATE_TAGS', { id, tags });
    })
  },
}
