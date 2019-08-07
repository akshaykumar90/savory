import _ from 'lodash'
import { router } from '../router'

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

function getFiltersFromQueryString(filterString) {
  return filterString.split('/').map(filter => {
    let peeled = filter.split(':')
    const type = peeled[0] === 's' ? 'site' : 'tag'
    const name = peeled[1]
    return { type, name }
  })
}

function getQueryStringFromFilters(filters) {
  return filters
    .map(({ type, name }) => encodeURIComponent(`${type[0]}:${name}`))
    .join('/')
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

  ON_FILTER_UPDATE: async ({ state, commit, getters }, filters) => {
    if (!filters.length) {
      commit('CLEAR_FILTERED')
    } else {
      let drillDownFilter = getDrillDownFunction(getters)
      let filteredIds = []
      for (const filter of filters) {
        filteredIds = await drillDownFilter(filteredIds, filter)
      }
      commit('UPDATE_SEARCH_FILTER', { active: filters, items: filteredIds })
      commit('SET_FILTERED', filteredIds)
    }
  },

  FILTER_ADDED: async ({ state }, { type, name, drillDown }) => {
    let newFilter = { type, name }
    const filterAlreadyExists = state.filter.active.some(x => _.isEqual(x, newFilter))
    if (filterAlreadyExists) {
      return
    }
    let activeFilters = drillDown ? [...state.filter.active, newFilter] : [newFilter]
    let filtersParam = getQueryStringFromFilters(activeFilters)
    router.push(`/filter/${filtersParam}`)
  },

  FILTER_REMOVED: async ({ state }, index) => {
    let currFilters = state.filter.active
    if (index < 0) {
      index += currFilters.length
    }
    let activeFilters = [...currFilters.slice(0, index), ...currFilters.slice(index+1)]
    let filtersParam = getQueryStringFromFilters(activeFilters)
    if (!filtersParam) {
      // end of filters, go home
      router.push('/')
    } else {
      router.push(`/filter/${filtersParam}`)
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

  ON_ROUTE_CHANGE: async ({ dispatch, commit }, { name, params }) => {
    if (name === 'home') {
      // Remove any filters, aka go to home page
      commit('CLEAR_FILTERED')
    } else if (name === 'filter') {
      let filters = getFiltersFromQueryString(params.filter)
      await dispatch('ON_FILTER_UPDATE', filters)
    } /* else if (name === 'list') {
      // Show list view. This is probably not the right way to do this. We
      // want to clear the activeListicleId in store, for example.
      let listId = params.list.trim()
      let listicle = await fetchList(listId)
      commit('SET_LISTICLE', listicle)
      commit('SWITCH_TO_LISTICLE_VIEW', listId)
    } */
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
