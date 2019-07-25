import {
  addNewTagForBookmark,
  deleteBookmarkTags,
  fetchBookmarksWithTag,
  fetchList,
  fetchRecent,
  fetchTagsForBookmarkIds,
  removeTagFromBookmark,
  searchBookmarks
} from '../api'

function getDrillDownFunction(getters) {
  return async function drillDownFilter(currentItems, { type, name }) {
    let bookmarkIds = []
    if (type === 'site') {
      bookmarkIds = getters.getBookmarkIdsWithSite(name)
    } else if (type === 'tag') {
      let bookmarksWithTag = await fetchBookmarksWithTag(name);
      bookmarkIds = bookmarksWithTag.map(({ id }) => id)
    } else {
      /* bad input */
      return currentItems
    }
    let currFiltered = new Set(currentItems)
    return currFiltered.size ? bookmarkIds.filter(x => currFiltered.has(x)) : bookmarkIds
  }
}

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

  FILTER_ADDED: async ({ state, commit, getters }, { type, name, drillDown }) => {
    let drillDownFilter = getDrillDownFunction(getters)
    let newFilter = { type, name }
    // We "drill down" the current set of results only from the search bar
    let activeFilters = drillDown ? [...state.filter.active, newFilter] : [newFilter]
    let currentItems = drillDown ? state.filter.items : []
    let filteredIds = await drillDownFilter(currentItems, { type, name })
    commit('UPDATE_SEARCH_FILTER', { active: activeFilters, items: filteredIds })
    commit('SET_FILTERED', filteredIds)
  },

  FILTER_REMOVED: async ({ state, commit, getters }, index) => {
    let drillDownFilter = getDrillDownFunction(getters)
    let currFilters = state.filter.active
    if (index < 0) {
      index += currFilters.length
    }
    const newFilters = [...currFilters.slice(0, index), ...currFilters.slice(index+1)]
    const reducer = async (acc, curr) => await drillDownFilter(acc, curr)
    if (!newFilters.length) {
      commit('CLEAR_FILTERED')
    } else {
      let filteredIds = await newFilters.reduce(reducer, [])
      commit('UPDATE_SEARCH_FILTER', { active: newFilters, items: filteredIds })
      commit('SET_FILTERED', filteredIds)
    }
  },

  SEARCH_QUERY: async ({ state, commit, getters }, query) => {
    if (!query) {
      // Empty query is valid input if there are active filters
      if (state.filter.active.length) {
        commit('SET_FILTERED', state.filter.items)
      } else {
        commit('CLEAR_FILTERED')
      }
    } else {
      let searchResults = await searchBookmarks(query)
      let currFiltered = new Set(state.filter.items)
      const filteredIds = currFiltered.size ? searchResults.filter(x => currFiltered.has(x)) : searchResults
      commit('SET_FILTERED', filteredIds)
    }
  },

  ON_ROUTE_CHANGE: async ({ dispatch, commit, getters }, { params }) => {
    if (params.hasOwnProperty('site')) {
      // Filter bookmarks by domain name
      let site = params.site.trim()
      await dispatch('FILTER_ADDED', { type: 'site', name: site })
    } else if (params.hasOwnProperty('tag')) {
      // Filter bookmarks by tag
      let tag = params.tag.trim()
      await dispatch('FILTER_ADDED', { type: 'tag', name: tag })
    } else if (params.hasOwnProperty('list')) {
      // Show list view. This is probably not the right way to do this. We
      // want to clear the activeListicleId in store, for example.
      let listId = params.list.trim()
      let listicle = await fetchList(listId);
      commit('SET_LISTICLE', listicle);
      commit('SWITCH_TO_LISTICLE_VIEW', listId);
    } else {
      // Remove any filters, aka go to home page
      commit('CLEAR_FILTERED')
    }
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tags: newTags }) => {
    addNewTagForBookmark({ id, tags: newTags }).then(({ tags }) => {
      commit('SET_TAGS', { id, tags });
    })
  },

  REMOVE_TAG_FROM_BOOKMARK: ({ commit }, { id, tag }) => {
    removeTagFromBookmark({ id, tag }).then(({ tags }) => {
      commit('SET_TAGS', { id, tags });
    })
  },
}
