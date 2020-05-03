import _ from 'lodash'
import { router } from '../router'

import {getBookmarks, searchBookmarks} from '../api'

import {
  importBookmarks,
  addNewTags,
  removeTag,
  fetchBookmarksWithTag,
  fetchRecent,
  getCount,
  setCount,
  deleteBookmark,
} from '../api/mongodb'

function getDrillDownFunction(getters) {
  return async function drillDownFilter(currentItems, { type, name }) {
    let bookmarkIds = []
    if (type === 'site') {
      bookmarkIds = getters.getBookmarkIdsWithSite(name)
    } else if (type === 'tag') {
      let bookmarksWithTag = await fetchBookmarksWithTag(name)
      bookmarkIds = bookmarksWithTag.map(({ chrome_id }) => chrome_id)
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
  SYNC_BOOKMARKS: async ({ state, dispatch, commit }, { num }) => {
    const initialLoadNum = 50
    let getCountPromise = getCount()
    let fetchTopBookmarksPromise = fetchRecent(initialLoadNum)
    let fetchAllBookmarksPromise = fetchRecent(num)
    let headBookmarks = await fetchTopBookmarksPromise
    for (let bookmark of headBookmarks) {
      bookmark.id = bookmark.chrome_id
    }
    commit('SET_BOOKMARKS', { items: headBookmarks })
    Event.$emit('newItems')
    let countResponse = await getCountPromise
    commit('SET_BOOKMARKS_COUNT', { count: countResponse ? countResponse.count : 0 })
    let allBookmarks = await fetchAllBookmarksPromise
    let tailBookmarks = allBookmarks.slice(initialLoadNum)
    for (let bookmark of tailBookmarks) {
      bookmark.id = bookmark.chrome_id
    }
    commit('SET_BOOKMARKS', { items: tailBookmarks })
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: allBookmarks.length })
    await setCount(state.numBookmarks)
  },

  LOAD_MORE_BOOKMARKS: ({ state, commit }) => {
    return new Promise(resolve => {
      // The setTimeout simulates async remote api call to load more content
      setTimeout(() => {
        commit('INCR_PAGE')
        const history = window.history
        const stateCopy = { ...history.state, page: state.page }
        history.replaceState(stateCopy, '')
        resolve()
      }, 100)
    })
  },

  ON_BOOKMARK_CREATED: async ({ state, commit }, { bookmark }) => {
    const { id, title, url, dateAdded } = bookmark
    commit('ADD_BOOKMARK', bookmark)
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks + 1 })
    await setCount(state.numBookmarks)
  },

  BULK_DELETE_BOOKMARKS: async ({ state, commit }) => {
    let currSelected = [...state.lists['selected']]
    currSelected.map(id => commit('REMOVE_BOOKMARK', { id }))
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks - currSelected.length })
    currSelected.map(async id => await deleteBookmark(id))
    await setCount(state.numBookmarks)
  },

  ON_BOOKMARK_REMOVED: async ({ state, commit }, { bookmark }) => {
    commit('REMOVE_BOOKMARK', bookmark)
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks - 1 })
    await setCount(state.numBookmarks)
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
    router.push(`/u/filter/${filtersParam}`)
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
      router.push(`/u/filter/${filtersParam}`)
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
    Event.$emit('newItems')
  },

  CLEAR_SEARCH: ({ commit }) => {
    // Remove any filters
    commit('CLEAR_FILTERED')

    // Notify app view of changes
    Event.$emit('newItems')

    // Go to home page, if not already there
    if (router.currentRoute.name !== 'app') {
      router.push('/u')
    }
  },

  FETCH_DATA_FOR_APP_VIEW: async ({ dispatch, commit }, { name, params }) => {
    if (name === 'app') {
      // Remove any filters, aka go to home page
      commit('CLEAR_FILTERED')
    } else if (name === 'filter') {
      let filters = getFiltersFromQueryString(params.filter)
      await dispatch('ON_FILTER_UPDATE', filters)
    }
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tags: newTags }) => {
    addNewTags(id, newTags).then(({ tags }) => {
      commit('SET_TAGS', { id, tags });
    })
  },

  REMOVE_TAG_FROM_BOOKMARK: ({ commit }, { id, tag }) => {
    removeTag(id, tag).then(({ tags }) => {
      commit('SET_TAGS', { id, tags });
    })
  },

  IMPORT_BROWSER_BOOKMARKS: async () => {
    let browserBookmarks = await getBookmarks(5000)
    let bookmarks = browserBookmarks.map(({ id, title, url, dateAdded }) => {
      return { chrome_id: id, title, url, dateAdded }
    })
    console.log('Starting import...')
    for (const chunk of _.chunk(bookmarks, 100)) {
      await importBookmarks(chunk)
    }
    console.log('...done!')
  },
}
