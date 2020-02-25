import _ from 'lodash'
import { router } from '../router'

import {
  addNewTagForBookmark,
  deleteBookmarkTags,
  fetchList,
  fetchRecent as fetchRecentChrome,
  fetchTagsForBookmarkIds,
  removeTagFromBookmark,
  searchBookmarks
} from '../api'

import {
  createBookmark,
  deleteBookmark,
  importBookmarks,
  addNewTags,
  removeTag,
  fetchBookmarksWithTag,
  getCount,
  setCount
} from '../api/mongodb'

import { fetchRecent } from '../api/mongodb'
import { mongoApp } from '../api/mongodb'
import { AnonymousCredential } from 'mongodb-stitch-browser-sdk'

function getDrillDownFunction(getters) {
  return async function drillDownFilter(currentItems, { type, name }) {
    const userId = 'test1'
    let bookmarkIds = []
    if (type === 'site') {
      bookmarkIds = getters.getBookmarkIdsWithSite(name)
    } else if (type === 'tag') {
      let bookmarksWithTag = await fetchBookmarksWithTag(userId, name)
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
    await mongoApp.auth.loginWithCredential(new AnonymousCredential())
    const userId = 'test1'
    const initialLoadNum = 50
    let getCountPromise = getCount(userId)
    let fetchTopBookmarksPromise = fetchRecent(userId, initialLoadNum)
    let fetchAllBookmarksPromise = fetchRecent(userId, num)
    let numChromeBookmarks = 100
    let loadRecentFromChrome = fetchRecentChrome(numChromeBookmarks)
    let headBookmarks = await fetchTopBookmarksPromise
    for (let bookmark of headBookmarks) {
      bookmark.id = bookmark.chrome_id
    }
    commit('SET_BOOKMARKS', { items: headBookmarks })
    let countResponse = await getCountPromise
    commit('SET_BOOKMARKS_COUNT', { count: countResponse ? countResponse.count : 0 })
    let allBookmarks = await fetchAllBookmarksPromise
    let tailBookmarks = allBookmarks.slice(initialLoadNum)
    for (let bookmark of tailBookmarks) {
      bookmark.id = bookmark.chrome_id
    }
    commit('SET_BOOKMARKS', { items: tailBookmarks })
    commit('SET_BOOKMARKS_COUNT', { count: allBookmarks.length })
    await setCount(userId, state.numBookmarks)
    let latestChromeIdFromMongo = headBookmarks[0].chrome_id
    while (true) {
      let chromeBookmarks = await loadRecentFromChrome
      let sortedBookmarks = _.sortBy(chromeBookmarks, [(b) => parseInt(b.id)])
      let found = _.sortedIndexBy(sortedBookmarks, { id: latestChromeIdFromMongo}, (x) => parseInt(x.id))
      if (sortedBookmarks[found].id === latestChromeIdFromMongo) {
        for (const bookmark of sortedBookmarks.slice(found + 1)) {
          dispatch('ON_BOOKMARK_CREATED', { bookmark })
        }
        break
      }
      numChromeBookmarks += 100
      loadRecentFromChrome = fetchRecentChrome(numChromeBookmarks)
    }
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

  ON_BOOKMARK_CREATED: async ({ state, commit }, { bookmark }) => {
    const userId = 'test1'
    const { id, title, url, dateAdded } = bookmark
    await createBookmark(userId, { chrome_id: id, title, url, dateAdded, tags: [] })
    commit('ADD_BOOKMARK', bookmark)
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks + 1 })
    await setCount(userId, state.numBookmarks)
  },

  ON_BOOKMARK_REMOVED: async ({ state, commit }, { bookmark }) => {
    const userId = 'test1'
    await deleteBookmark(userId, bookmark.id)
    commit('REMOVE_BOOKMARK', bookmark)
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks - 1 })
    await setCount(userId, state.numBookmarks)
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
    const userId = 'test1'
    addNewTags(userId, id, newTags).then(({ tags }) => {
      commit('SET_TAGS', { id, tags });
    })
  },

  REMOVE_TAG_FROM_BOOKMARK: ({ commit }, { id, tag }) => {
    const userId = 'test1'
    removeTag(userId, id, tag).then(({ tags }) => {
      commit('SET_TAGS', { id, tags });
    })
  },

  EXPORT_BOOKMARKS: async ({ state }) => {
    const userId = 'test1'
    let bookmarks = Object.values(state.bookmarks).map(({ id, title, url, dateAdded, tags }) => {
      return { chrome_id: id, title, url, dateAdded, tags }
    })
    console.log('Starting import...')
    for (const chunk of _.chunk(bookmarks, 100)) {
      await importBookmarks(userId, chunk)
    }
    console.log('...done!')
  },

  IMPORT_TAGS: ({ state, dispatch }, { jsonBlob }) => {
    console.log('Starting tags import...')
    let { tags } = JSON.parse(jsonBlob)
    let urls = new Map()
    for (const { url, tags: bookmarkTags } of tags) {
      urls.set(url, bookmarkTags)
    }
    _.forOwn(state.bookmarks, function({ id, url }, key) {
      if (urls.has(url)) {
        console.log(`Key: ${key} => (${id}, ${urls.get(url)})`)
        dispatch('ADD_TAG_FOR_BOOKMARK', { id, tags: urls.get(url)})
      }
    })
  },
}
