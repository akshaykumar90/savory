import _ from 'lodash'
import { router } from '../../router'
import { incrementAndGet, isRequestSuperseded } from '../../api/search'

// TODO: this file deserves a big comment about the view-model design it
//  prescribes

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
    search: [],
  },
  filter: {
    active: [
      /* { type: string, name: string } */
    ],
    total: 0,
  },
  search: {
    query: '',
    total: 0,
  },
})

const getters = {
  maxPage(state, getters) {
    return Math.ceil(getters.numBookmarks / state.itemsPerPage)
  },

  activeIds(state) {
    const { activeType, itemsPerPage, page, lists } = state

    // const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage

    return lists[activeType].slice(0 /* start */, end)
  },

  numBookmarks(state, getters, rootState) {
    switch (state.activeType) {
      case 'new':
        return rootState.bookmarks.numBookmarks
      case 'filtered':
        return state.filter.total
      case 'search':
        return state.search.total
      default:
        return 0
    }
  },

  fetchMoreAction(state) {
    switch (state.activeType) {
      case 'new':
        return 'FETCH_BOOKMARKS'
      case 'filtered':
        return 'FETCH_BOOKMARKS_WITH_TAG'
      case 'search':
        return 'FETCH_BOOKMARKS_WITH_QUERY'
      default:
        return 'UNKNOWN'
    }
  },

  getRequestArgs: (state, getters) => ({
    listName,
    query: q,
    filters: f,
    more,
  }) => {
    const { activeType, itemsPerPage, page, lists, filter, search } = state
    const listType = listName || activeType
    let requestObj = {
      num: itemsPerPage,
    }
    switch (listType) {
      case 'filtered':
        const filters = more ? filter.active : f
        Object.assign(requestObj, {
          tags: filters
            .filter(({ type }) => type === 'tag')
            .map(({ name }) => name),
          site: filters
            .filter(({ type }) => type === 'site')
            .reduce((acc, { name }) => name, ''),
        })
        break
      case 'search':
        const query = more ? search.query : q
        Object.assign(requestObj, {
          query,
        })
    }
    if (more) {
      if (listType === 'search') {
        Object.assign(requestObj, {
          skip: page * itemsPerPage,
        })
      } else {
        const [lastItem] = lists[listType].slice(-1)
        Object.assign(requestObj, {
          after: getters.getBookmarkById(lastItem).dateAdded,
        })
      }
    }
    return requestObj
  },
}

const actions = {
  LOAD_MORE_BOOKMARKS: ({ state, getters, commit, dispatch }) => {
    return dispatch(
      getters.fetchMoreAction,
      getters.getRequestArgs({ more: true })
    ).then((result) => {
      const ids = result.bookmarks.map(({ id }) => id)
      commit('ADD_TO_BACK', { ids })
      commit('INCR_PAGE')
      const history = window.history
      const stateCopy = { ...history.state, page: state.page }
      history.replaceState(stateCopy, '')
    })
  },

  ON_FILTER_UPDATE: async ({ state, dispatch, commit, getters }, filters) => {
    if (!filters.length) {
      commit('CLEAR_FILTERED')
    } else {
      let queryObj = getters.getRequestArgs({ listName: 'filtered', filters })
      let result = await dispatch('FETCH_BOOKMARKS_WITH_TAG', queryObj)
      const ids = result.bookmarks.map(({ id }) => id)
      commit('SET_FILTERED', { filters, ids, total: result.total })
      commit('SWITCH_TO_FILTERED')
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

  SEARCH_QUERY: async ({ state, commit, dispatch, getters }, query) => {
    let requestId = incrementAndGet()
    if (!query) {
      // Empty query is valid input if there are active filters
      if (state.filter.active.length) {
        commit('SWITCH_TO_FILTERED')
      } else {
        commit('CLEAR_FILTERED')
      }
    } else {
      let queryObj = getters.getRequestArgs({ listName: 'search', query })
      let result = await dispatch('FETCH_BOOKMARKS_WITH_QUERY', queryObj)
      if (isRequestSuperseded(requestId)) {
        return
      }
      const ids = result.bookmarks.map(({ id }) => id)
      commit('SET_SEARCH', { query, ids, total: result.total })
      commit('SWITCH_TO_SEARCH')
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

    // fixme: this is fishy? :thinking:

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
    commit('SCRUB_FROM_LIST', { type: 'search', ids })
  },
}

const mutations = {
  // N.B. this is needed for new bookmarks getting added
  ADD_TO_FRONT: (state, { ids }) => {
    state.lists['new'] = [...ids, ...state.lists['new']]
  },

  ADD_TO_BACK: (state, { ids }) => {
    const { activeType } = state
    state.lists[activeType] = [...state.lists[activeType], ...ids]
  },

  SET_FILTERED: (state, { filters, ids, total }) => {
    state.lists['filtered'] = ids
    state.filter = { active: filters, total }
  },

  SWITCH_TO_FILTERED: (state) => {
    state.activeType = 'filtered'
    state.page = 1
  },

  CLEAR_FILTERED: (state) => {
    state.lists['filtered'] = []
    state.lists['search'] = []
    state.filter = { active: [], total: 0 }
    state.search = { query: '', total: 0 }
    state.activeType = 'new'
    state.page = 1
  },

  SET_SEARCH: (state, { query, ids, total }) => {
    state.lists['search'] = ids
    state.search = { query, total }
  },

  SWITCH_TO_SEARCH: (state) => {
    state.activeType = 'search'
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
