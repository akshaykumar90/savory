import _ from 'lodash'
import { router } from '../../router'
import { incrementAndGet, isRequestSuperseded } from '../../api/search'
import { searchBookmarks } from '../../api/mongodb'

function getDrillDownFunction({ dispatch, getters }) {
  return async function drillDownFilter(currentItems, { type, name }) {
    let bookmarkIds = []
    if (type === 'site') {
      bookmarkIds = getters.getBookmarkIdsWithSite(name)
    } else if (type === 'tag') {
      bookmarkIds = await dispatch('FETCH_BOOKMARK_IDS_WITH_TAG', { tag: name })
    } else {
      /* bad input */
      return currentItems
    }
    let currFiltered = new Set(currentItems)
    return currFiltered.size
      ? bookmarkIds.filter((x) => currFiltered.has(x))
      : bookmarkIds
  }
}

function getFiltersFromQueryString(filterString) {
  return filterString.split('/').map((filter) => {
    let peeled = filter.split(':')
    const type = peeled[0] === 's' ? 'site' : 'tag'
    const name = peeled[1]
    return { type, name }
  })
}

function getQueryStringFromFilters(filters) {
  return filters
    .map(({ type, name }) => `${type[0]}:${encodeURIComponent(name)}`)
    .join('/')
}

const state = () => ({
  activeType: 'new',
  itemsPerPage: 100,
  page: 1,
  lists: {
    new: [
      /* number */
    ],
    filtered: [],
  },
  filter: {
    active: [
      /* { type: string, name: string } */
    ],
    items: [
      /* number */
    ],
  },
})

const getters = {
  maxPage(state) {
    const { activeType, itemsPerPage, lists } = state
    return Math.ceil(lists[activeType].length / itemsPerPage)
  },

  activeIds(state) {
    const { activeType, itemsPerPage, page, lists } = state

    // const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage

    return lists[activeType].slice(0 /* start */, end)
  },

  numBookmarks(state, getters, rootState) {
    const { activeType, lists } = state
    if (activeType === 'new') {
      return rootState.bookmarks.numBookmarks
    } else {
      return lists[activeType].length
    }
  },
}

const actions = {
  LOAD_MORE_BOOKMARKS: ({ state, commit }) => {
    return new Promise((resolve) => {
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

  ON_FILTER_UPDATE: async ({ dispatch, commit, rootGetters }, filters) => {
    if (!filters.length) {
      commit('CLEAR_FILTERED')
    } else {
      let drillDownFilter = getDrillDownFunction({
        dispatch,
        getters: rootGetters,
      })
      let filteredIds = []
      for (const filter of filters) {
        filteredIds = await drillDownFilter(filteredIds, filter)
      }
      commit('UPDATE_SEARCH_FILTER', { active: filters, items: filteredIds })
      commit('SET_FILTERED', filteredIds)
    }
    commit('CLEAR_SELECTED')
  },

  FILTER_ADDED: ({ state }, { type, name, drillDown }) => {
    let newFilter = { type, name }
    const filterAlreadyExists = state.filter.active.some((x) =>
      _.isEqual(x, newFilter)
    )
    if (filterAlreadyExists) {
      return Promise.resolve()
    }
    let activeFilters = drillDown
      ? [...state.filter.active, newFilter]
      : [newFilter]
    let filtersParam = getQueryStringFromFilters(activeFilters)
    return router.push(`/tags/${filtersParam}`)
  },

  FILTER_REMOVED: ({ state }, index) => {
    let currFilters = state.filter.active
    if (index < 0) {
      index += currFilters.length
    }
    let activeFilters = [
      ...currFilters.slice(0, index),
      ...currFilters.slice(index + 1),
    ]
    let filtersParam = getQueryStringFromFilters(activeFilters)
    return filtersParam
      ? router.push(`/tags/${filtersParam}`)
      : router.push('/')
  },

  SEARCH_QUERY: async ({ state, commit }, query) => {
    let requestId = incrementAndGet()
    if (!query) {
      // Empty query is valid input if there are active filters
      if (state.filter.active.length) {
        commit('SET_FILTERED', state.filter.items)
      } else {
        commit('CLEAR_FILTERED')
      }
    } else {
      let searchResults = await searchBookmarks({ query })
      if (isRequestSuperseded(requestId)) {
        return
      }
      let currFiltered = new Set(state.filter.items)
      const filteredIds = currFiltered.size
        ? searchResults.filter((x) => currFiltered.has(x))
        : searchResults
      commit('SET_FILTERED', filteredIds)
    }
    commit('CLEAR_SELECTED')
    Event.$emit('newItems')
  },

  CLEAR_SEARCH: ({ commit }) => {
    // Remove any filters
    commit('CLEAR_FILTERED')
    commit('CLEAR_SELECTED')

    // Notify app view of changes
    Event.$emit('newItems')

    // Go to home page, if not already there
    return router.currentRoute.name === 'app'
      ? Promise.resolve()
      : router.push('/')
  },

  FETCH_DATA_FOR_APP_VIEW: ({ dispatch, commit }, { name, params }) => {
    if (name === 'app') {
      // Remove any filters, aka go to home page
      commit('CLEAR_FILTERED')
      commit('CLEAR_SELECTED')
      return Promise.resolve()
    } else if (name === 'tags') {
      let filters = getFiltersFromQueryString(params.tag)
      return dispatch('ON_FILTER_UPDATE', filters)
    }
  },

  SCRUB_LISTS: ({ commit }, { ids }) => {
    commit('SCRUB_FROM_LIST', { type: 'new', ids })
    commit('SCRUB_FROM_LIST', { type: 'filtered', ids })
  },
}

const mutations = {
  ADD_TO_FRONT: (state, { ids }) => {
    state.lists['new'] = [...ids, ...state.lists['new']]
  },

  ADD_TO_BACK: (state, { ids }) => {
    state.lists['new'] = [...state.lists['new'], ...ids]
  },

  SET_FILTERED: (state, ids) => {
    state.lists['filtered'] = ids
    state.page = 1
    state.activeType = 'filtered'
  },

  UPDATE_SEARCH_FILTER: (state, filter) => {
    state.filter = filter
  },

  CLEAR_FILTERED: (state) => {
    state.lists['filtered'] = []
    state.filter = { active: [], items: [] }
    state.activeType = 'new'
    state.page = 1
  },

  SCRUB_FROM_LIST: (state, { type, ids }) => {
    let currList = state.lists[type]
    state.lists[type] = currList.filter((x) => !ids.includes(x))
  },

  INCR_PAGE: (state) => {
    state.page += 1
  },

  SET_PAGE: (state, page) => {
    state.page = page
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
