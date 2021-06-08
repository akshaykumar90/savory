import _ from 'lodash'
import Vue from 'vue'
import { router } from '../../router'

// TODO: this file deserves a big comment about the view-model design it
//  prescribes

function getFiltersFromQueryString(filterString) {
  return filterString.split('/').map((filter) => {
    // We have to do this dance because `:` can be part of the name of tag
    const on = ':'
    let [first, ...rest] = filter.split(on)
    const type = first === 's' ? 'site' : 'tag'
    const name = rest.join(on)
    return { type, name }
  })
}

function getQueryStringFromFilters(filters) {
  return filters
    .map(({ type, name }) => `${type[0]}:${encodeURIComponent(name)}`)
    .join('/')
}

function withSavingSpinner(fn) {
  return ({ state, commit, dispatch }, obj) => {
    commit('SET_SAVING')
    const myOperationId = state.save.operationId
    return fn({ state, commit, dispatch }, obj)
      .catch((e) => console.log('error: ', e))
      .finally(() => {
        commit('CLEAR_SAVING', myOperationId)
      })
  }
}

class ArgumentBuilder {
  constructor() {
    this.argObj = {}
  }

  withNum(numItems) {
    Object.assign(this.argObj, {
      num: numItems,
    })
    return this
  }

  withFilters(filters) {
    Object.assign(this.argObj, {
      tags: filters
        .filter(({ type }) => type === 'tag')
        .map(({ name }) => name),
      site: filters
        .filter(({ type }) => type === 'site')
        .reduce((acc, { name }) => name, ''),
    })
    return this
  }

  withQuery(query) {
    Object.assign(this.argObj, {
      query,
    })
    return this
  }

  build() {
    return this.argObj
  }
}

const state = () => ({
  activeType: '',
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
  bulk: {
    ids: new Set(),
  },
  loading: false, // load more
  requestId: 0,
  fetchPromise: null, // pending navigation
  save: {
    operationId: 0,
    // pending save to backend, do not eject!
    pending: false,
  },
})

const getters = {
  maxPage(state, getters) {
    return Math.ceil(getters.numBookmarks / state.itemsPerPage)
  },

  activeIds(state) {
    const { activeType, itemsPerPage, page, lists } = state

    if (!['new', 'filtered', 'search'].includes(activeType)) {
      return []
    }

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

  fetchDataArgs(state) {
    const { itemsPerPage, filter, search } = state
    let argBuilder = new ArgumentBuilder().withNum(itemsPerPage)
    if (filter.active.length) {
      argBuilder = argBuilder.withFilters(filter.active)
    }
    if (search.query !== '') {
      argBuilder = argBuilder.withQuery(search.query)
    }
    return argBuilder.build()
  },

  fetchMoreArgs(state, getters) {
    const { activeType, itemsPerPage, page, lists } = state
    switch (state.activeType) {
      case 'search':
        return {
          skip: page * itemsPerPage,
        }
      case 'new':
      case 'filtered':
        const [lastItem] = lists[activeType].slice(-1)
        return {
          before: getters.getBookmarkById(lastItem).dateAdded,
        }
      default:
        return {}
    }
  },

  numSelected(state) {
    return state.bulk.ids.size
  },

  tagsInBulkEdit(state, getters) {
    let allTags = []
    for (let bookmarkId of state.bulk.ids) {
      allTags = allTags.concat(getters.getBookmarkById(bookmarkId).tags)
    }
    let setUnion = Array.from(new Set(allTags))
    setUnion.sort()
    return setUnion
  },
}

const actions = {
  LOAD_NEW_BOOKMARKS: async ({ state, commit, dispatch }, { page }) => {
    commit('INCR_REQUEST_ID')
    let myRequestId = state.requestId
    const { lists, itemsPerPage } = state
    const maxPage = page || 1
    if (lists['new'].length === 0) {
      let result = await dispatch(
        'FETCH_BOOKMARKS',
        new ArgumentBuilder().withNum(itemsPerPage * maxPage).build()
      )
      if (myRequestId < state.requestId) {
        return Promise.reject(
          `Stale request id: ${myRequestId} current: ${state.requestId}`
        )
      }
      const ids = result.bookmarks.map(({ id }) => id)
      commit('SET_NEW', { ids })
    }
    dispatch('CLEAR_SELECTED')
    commit('CLEAR_FILTERED')
    commit('SWITCH_TO_NEW')
    commit('SET_PAGE', maxPage)
  },

  LOAD_MORE_BOOKMARKS: ({ state, getters, commit, dispatch }) => {
    if (state.loading || state.fetchPromise !== null) {
      // Yield if a navigation is pending
      return Promise.resolve()
    }
    commit('INCR_REQUEST_ID')
    let myRequestId = state.requestId
    commit('SET_LOADING')
    return dispatch(getters.fetchMoreAction, {
      ...getters.fetchDataArgs,
      ...getters.fetchMoreArgs,
    })
      .then((result) => {
        if (myRequestId < state.requestId) {
          return Promise.reject(
            `Stale request id: ${myRequestId} current: ${state.requestId}`
          )
        }
        const ids = result.bookmarks.map(({ id }) => id)
        commit('ADD_TO_BACK', { ids })
        commit('INCR_PAGE')
        const history = window.history
        const stateCopy = { ...history.state, page: state.page }
        history.replaceState(stateCopy, '')
      })
      .finally(() => {
        commit('UNSET_LOADING')
      })
  },

  ON_FILTER_UPDATE: async (
    { state, dispatch, commit, getters },
    { filters, page }
  ) => {
    if (!filters.length) {
      return dispatch('CLEAR_SEARCH')
    }
    commit('INCR_REQUEST_ID')
    let myRequestId = state.requestId
    const { itemsPerPage } = state
    const maxPage = page || 1
    let result = await dispatch(
      'FETCH_BOOKMARKS_WITH_TAG',
      new ArgumentBuilder()
        .withNum(itemsPerPage * maxPage)
        .withFilters(filters)
        .build()
    )
    if (myRequestId < state.requestId) {
      return Promise.reject(
        `Stale request id: ${myRequestId} current: ${state.requestId}`
      )
    }
    commit('SET_FILTERS', { filters })
    const ids = result.bookmarks.map(({ id }) => id)
    commit('SET_FILTERED_ITEMS', { ids, total: result.total })
    commit('SWITCH_TO_FILTERED')
    dispatch('CLEAR_SELECTED')
    commit('SET_PAGE', maxPage)
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
    if (query === state.search.query) {
      return Promise.resolve()
    }
    if (!query) {
      commit('CLEAR_SEARCH_ITEMS')
      // Empty query is valid input if there are active filters
      return dispatch('ON_FILTER_UPDATE', { filters: state.filter.active })
    }
    commit('INCR_REQUEST_ID')
    commit('SET_SEARCH_QUERY', { query })
    let myRequestId = state.requestId
    const { itemsPerPage, filter } = state
    let result = await dispatch(
      'FETCH_BOOKMARKS_WITH_QUERY',
      new ArgumentBuilder()
        .withNum(itemsPerPage)
        .withFilters(filter.active)
        .withQuery(query)
        .build()
    )
    if (myRequestId < state.requestId) {
      return Promise.reject(
        `Stale request id: ${myRequestId} current: ${state.requestId}`
      )
    }
    const ids = result.bookmarks.map(({ id }) => id)
    commit('SET_SEARCH_ITEMS', { ids, total: result.total })
    commit('SWITCH_TO_SEARCH')
    dispatch('CLEAR_SELECTED')
  },

  CLEAR_SEARCH: ({ dispatch }) => {
    // Go to home page, if not already there
    return router.currentRoute.name === 'app'
      ? dispatch('LOAD_NEW_BOOKMARKS', { page: 1 })
      : router.push('/')
  },

  FETCH_DATA_FOR_VIEW: ({ dispatch, commit }, { name, params }) => {
    const page = window.history.state && window.history.state.page
    if (name === 'app') {
      return dispatch('LOAD_NEW_BOOKMARKS', { page: page || 1 })
    } else if (name === 'tags') {
      let filters = getFiltersFromQueryString(params.tag)
      return dispatch('ON_FILTER_UPDATE', { filters, page: page || 1 })
    }
  },

  FETCH_DATA_FOR_ROUTE: ({ state, dispatch, commit }, { route }) => {
    const fetchPromise = dispatch({
      type: 'FETCH_DATA_FOR_VIEW',
      name: route.name,
      params: route.params,
    })
    commit('SET_FETCH_PROMISE', fetchPromise)
    // We must clear the promise stored in state when the route change
    // finishes. Otherwise, load more will break.
    //
    // We could do this in a `.then` clause. It also seems to work if the
    // request gets superseded by another route change request. The original
    // promise will be rejected but since the promise in the state object
    // would also have been replaced with the more recent promise, we should
    // be good. Right?
    //
    // Well, almost.
    //
    // The request might also get interrupted by a search query. Since it's
    // not a route change, the state object will still hold on to its original
    // promise which will end up in a rejected state but never cleared.
    //
    // Instead, we do the clearing in a `.finally` clause so that rejected
    // promises are also handled correctly. To avoid incorrectly clearing a
    // promise set by a later request, we make sure the promise in the state
    // is the same as the promise captured in the closure.
    return fetchPromise.finally(() => {
      if (fetchPromise === state.fetchPromise) {
        commit('CLEAR_FETCH_PROMISE')
      }
    })
  },

  SCRUB_LISTS: ({ state, commit }, { ids }) => {
    const { activeType, filter } = state
    commit('SCRUB_FROM_LIST', { type: 'new', ids })
    commit('SCRUB_FROM_LIST', { type: 'filtered', ids })
    commit('SCRUB_FROM_LIST', { type: 'search', ids })
    if (activeType === 'search') {
      commit('DEC_SEARCH_COUNT', { delta: ids.length })
    }
    if (filter.active.length) {
      commit('DEC_FILTERED_COUNT', { delta: ids.length })
    }
  },

  SELECT_ALL: ({ commit, getters }) => {
    let activeIds = getters.activeIds
    commit('SET_SELECTED', { ids: activeIds, isChecked: true })
    commit('ADD_TO_BULK_ITEMS', activeIds)
  },

  BOOKMARK_SELECTED: ({ state, commit, getters }, { id }) => {
    commit('SET_SELECTED', { ids: [id], isChecked: true })
    commit('ADD_TO_BULK_ITEMS', [id])
  },

  BOOKMARK_UNSELECTED: ({ state, commit }, { id }) => {
    commit('SET_SELECTED', { ids: [id], isChecked: false })
    commit('REMOVE_FROM_BULK_ITEMS', id)
  },

  ADD_TAG_TO_SELECTED: ({ state, dispatch }, { tag }) => {
    return dispatch('ADD_TAG_MANY', { ids: Array.from(state.bulk.ids), tag })
  },

  REMOVE_TAG_FROM_SELECTED: ({ state, dispatch }, { tag }) => {
    return dispatch('REMOVE_TAG_MANY', { ids: Array.from(state.bulk.ids), tag })
  },

  DELETE_SELECTED: ({ state, dispatch }) => {
    let currSelected = Array.from(state.bulk.ids)
    dispatch('CLEAR_SELECTED')
    return dispatch('BULK_DELETE_BOOKMARKS', { ids: currSelected })
  },

  CLEAR_SELECTED: ({ state, commit }) => {
    let currSelected = Array.from(state.bulk.ids)
    commit('SET_SELECTED', { ids: currSelected, isChecked: false })
    commit('CLEAR_BULK_ITEMS')
  },
}

const mutations = {
  ADD_TO_BACK: (state, { ids }) => {
    const { activeType } = state
    state.lists[activeType] = [...state.lists[activeType], ...ids]
  },

  SET_FILTERS: (state, { filters }) => {
    state.filter.active = filters
  },

  SET_FILTERED_ITEMS: (state, { ids, total }) => {
    state.lists['filtered'] = ids
    state.filter.total = total
  },

  DEC_FILTERED_COUNT: (state, { delta }) => {
    state.filter.total -= delta
  },

  SWITCH_TO_FILTERED: (state) => {
    state.activeType = 'filtered'
  },

  CLEAR_FILTERED: (state) => {
    state.lists['filtered'] = []
    state.lists['search'] = []
    state.filter = { active: [], total: 0 }
    state.search = { query: '', total: 0 }
  },

  SET_SEARCH_QUERY: (state, { query }) => {
    state.search.query = query
  },

  SET_SEARCH_ITEMS: (state, { ids, total }) => {
    state.lists['search'] = ids
    state.search.total = total
  },

  DEC_SEARCH_COUNT: (state, { delta }) => {
    state.search.total -= delta
  },

  SWITCH_TO_SEARCH: (state) => {
    state.activeType = 'search'
    // You can never come 'back' to a search since searches do not get a
    // history entry. Therefore, it is safe to always reset page to 1 here.
    state.page = 1
  },

  CLEAR_SEARCH_ITEMS: (state) => {
    state.lists['search'] = []
    state.search = { query: '', total: 0 }
  },

  SET_NEW: (state, { ids }) => {
    state.lists['new'] = ids
  },

  SWITCH_TO_NEW: (state) => {
    state.activeType = 'new'
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

  SET_LOADING: (state) => {
    state.loading = true
  },

  UNSET_LOADING: (state) => {
    state.loading = false
  },

  INCR_REQUEST_ID: (state) => {
    state.requestId += 1
  },

  SET_FETCH_PROMISE: (state, promise) => {
    state.fetchPromise = promise
  },

  CLEAR_FETCH_PROMISE: (state) => {
    state.fetchPromise = null
  },

  SET_SAVING: (state) => {
    state.save.operationId += 1
    state.save.pending = true
  },

  CLEAR_SAVING: (state, operationId) => {
    if (state.save.operationId === operationId) {
      state.save.pending = false
    }
  },

  ADD_TO_BULK_ITEMS: (state, ids) => {
    const newItems = new Set(state.bulk.ids)
    ids.forEach((id) => newItems.add(id))
    Vue.set(state.bulk, 'ids', newItems)
  },

  REMOVE_FROM_BULK_ITEMS: (state, id) => {
    const newItems = new Set(Array.from(state.bulk.ids).filter((x) => x !== id))
    Vue.set(state.bulk, 'ids', newItems)
  },

  CLEAR_BULK_ITEMS: (state) => {
    Vue.set(state.bulk, 'ids', new Set())
  },
}

for (const actionName of [
  'ADD_TAG_TO_SELECTED',
  'REMOVE_TAG_FROM_SELECTED',
  'DELETE_SELECTED',
]) {
  actions[actionName] = withSavingSpinner(actions[actionName])
}

export default {
  state,
  getters,
  actions,
  mutations,
}
