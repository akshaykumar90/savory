import Vue from 'vue'
import {
  addTag as dbAddTag,
  deleteBookmark,
  fetchRecent,
  getCount,
  removeTag as dbRemoveTag,
  setCount,
} from '../../api/mongodb'
import _ from 'lodash'
const { getDomain } = require('tldjs')

export const NUM_SYNC_BOOKMARKS = 6000

/**
 * Vue cannot detect changes in a set naively. For example, the following
 * would not work:
 *
 * ```
 * state.tags[tag].add({ dateAdded, id })
 * ```
 *
 * Also, this does not help:
 *
 * ```
 * Vue.set(state.tags, tag, tagIndex)
 * ```
 *
 * since the object reference is the same.
 *
 * Instead, we must assign a new set object to trigger reactivity.
 */
function addTag(state, tag, { id, dateAdded }) {
  const newTagIndex = new Set(state.tags[tag])
  newTagIndex.add({ dateAdded, id })
  Vue.set(state.tags, tag, newTagIndex)
}

/**
 * Deletes are similar. We cannot just remove an item from the set and expect
 * the change to be propagated to the view. The following does not work:
 *
 * ```
 * tagIndex.forEach((x) => {
 *   if (x.id === bookmarkId) {
 *     tagIndex.delete(x)
 *   }
 * })
 *
 * Vue.set(state.tags, tag, tagIndex)
 * ```
 *
 * We need to assign a new Set object to trigger reactivity.
 */
function deleteTag(state, tag, bookmarkId) {
  const newTagIndex = new Set()
  state.tags[tag].forEach((x) => {
    if (x.id !== bookmarkId) {
      newTagIndex.add(x)
    }
  })
  state.tags[tag] = newTagIndex
  if (state.tags[tag].size === 0) {
    Vue.delete(state.tags, tag)
  }
}

function domainName(bookmarkURL) {
  const url = new URL(bookmarkURL)
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return getDomain(url.hostname)
}

function addBookmark(state, { id, title, dateAdded, url, tags }) {
  tags.forEach((t) => addTag(state, t, { id, dateAdded }))
  Vue.set(state.bookmarks, id, {
    id,
    title,
    dateAdded,
    url,
    site: domainName(url),
    tags,
    selected: false,
  })
}

const state = () => ({
  bookmarks: {
    /* [id: string]: Bookmark */
  },
  tags: {
    /* [name: string]: Set({ id: string, dateAdded: number }) */
  },
  numBookmarks: 0,
})

const getters = {
  getBookmarkById: (state) => (id) => {
    return state.bookmarks[id]
  },

  getBookmarkIdsWithSite: (state) => (qsite) => {
    const unsortedBookmarks = Object.values(state.bookmarks).filter(
      ({ site }) => qsite === site
    )
    return _.orderBy(unsortedBookmarks, ['dateAdded'], ['desc']).map(
      ({ id }) => id
    )
  },

  getBookmarkIdsWithTag: (state) => (tag) => {
    const unsortedTags = Array.from(state.tags[tag])
    return _.orderBy(unsortedTags, ['dateAdded'], ['desc']).map(({ id }) => id)
  },

  tagNames: (state) => {
    return Array.from(Object.keys(state.tags))
  },

  tagsCount: (state) => {
    return Object.entries(state.tags).map(([tag, bookmarkIds]) => [
      tag,
      bookmarkIds.size,
    ])
  },

  numSelected(state) {
    let count = 0
    _.forOwn(state.bookmarks, (val) => {
      count += val.selected
    })
    return count
  },
}

const actions = {
  SYNC_BOOKMARKS: async ({ state, commit }) => {
    const firstLoadNum = 50
    let getCountPromise = getCount()
    const fetchReqs = [
      fetchRecent(firstLoadNum),
      fetchRecent(NUM_SYNC_BOOKMARKS),
    ]
    let loadedCount = 0
    for (const req of fetchReqs) {
      let bookmarks = await req
      bookmarks = bookmarks.slice(loadedCount)
      commit('SET_BOOKMARKS', { items: bookmarks })
      loadedCount += bookmarks.length
      let ids = bookmarks.map(({ id }) => id)
      commit('ADD_TO_BACK', { ids })
      Event.$emit('newItems')
      let countResponse = await getCountPromise
      commit('SET_BOOKMARKS_COUNT', {
        count: countResponse ? countResponse.count : 0,
      })
    }
    commit('SET_BOOKMARKS_COUNT', { count: loadedCount })
    return setCount(state.numBookmarks)
  },

  ON_BOOKMARK_CREATED: ({ state, commit }, { bookmark }) => {
    commit('ADD_BOOKMARK', bookmark)
    commit('ADD_TO_FRONT', { ids: [bookmark.id] })
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks + 1 })
    return setCount(state.numBookmarks)
  },

  BULK_DELETE_BOOKMARKS: async ({ state, commit, dispatch }) => {
    let currSelected = []
    _.forOwn(state.bookmarks, (val, key) => {
      if (val.selected) {
        currSelected.push(key)
      }
    })
    await dispatch('SCRUB_LISTS', { ids: currSelected })
    currSelected.map((id) => commit('REMOVE_BOOKMARK', { id }))
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', {
      count: state.numBookmarks - currSelected.length,
    })
    currSelected.map(async (id) => await deleteBookmark(id))
    return setCount(state.numBookmarks)
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    commit('ADD_TAG', { id, tag })
    return dbAddTag(id, tag)
  },

  REMOVE_TAG_FROM_BOOKMARK: ({ commit }, { id, tag }) => {
    commit('REMOVE_TAG', { id, tag })
    return dbRemoveTag(id, tag)
  },
}

const mutations = {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach((item) => addBookmark(state, item))
  },

  SET_BOOKMARKS_COUNT: (state, { count }) => {
    state.numBookmarks = count
  },

  ADD_BOOKMARK: (state, { id, title, dateAdded, url }) => {
    addBookmark(state, { id, title, dateAdded, url, tags: [] })
  },

  REMOVE_BOOKMARK: (state, { id: idToDelete }) => {
    let existingTags = state.bookmarks[idToDelete].tags
    existingTags.forEach((t) => deleteTag(state, t, idToDelete))
    Vue.delete(state.bookmarks, idToDelete)
  },

  ADD_TAG: (state, { id, tag }) => {
    if (!state.bookmarks[id].tags.includes(tag)) {
      addTag(state, tag, { id, dateAdded: state.bookmarks[id].dateAdded })
      state.bookmarks[id].tags = [...state.bookmarks[id].tags, tag]
    }
  },

  REMOVE_TAG: (state, { id, tag: tagToRemove }) => {
    deleteTag(state, tagToRemove, id)
    let existingTags = state.bookmarks[id].tags
    state.bookmarks[id].tags = existingTags.filter((t) => t !== tagToRemove)
  },

  CLEAR_SELECTED: (state) => {
    _.forOwn(state.bookmarks, (val, id) => {
      state.bookmarks[id].selected = false
    })
  },

  CLEAR_STATE: (state) => {
    state.bookmarks = {}
    state.tags = {}
    state.numBookmarks = 0
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
