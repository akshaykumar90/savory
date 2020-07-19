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

function addTag(state, tag, bookmarkId) {
  let bookmarkIdsWithTag = state.tags[tag] || []
  bookmarkIdsWithTag.push(bookmarkId)
  Vue.set(state.tags, tag, bookmarkIdsWithTag)
}

function deleteTag(state, tag, bookmarkId) {
  const updatedTags = state.tags[tag].filter((id) => id !== bookmarkId)
  let count = updatedTags.length
  if (count === 0) {
    Vue.delete(state.tags, tag)
  } else {
    Vue.set(state.tags, tag, updatedTags)
  }
}

function domainName(bookmarkURL) {
  const url = new URL(bookmarkURL)
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return getDomain(url.hostname)
}

function addBookmark(state, { id, title, dateAdded, url, tags }) {
  tags.forEach((t) => addTag(state, t, id))
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
    /* [id: number]: Bookmark */
  },
  tags: {
    /* [name: string]: [ BookmarkId ] */
  },
  numBookmarks: 0,
})

const getters = {
  getBookmarkById: (state) => (id) => {
    return state.bookmarks[id]
  },

  getBookmarkIdsWithSite: (state) => (site) => {
    return Object.keys(state.bookmarks).filter(
      (id) => state.bookmarks[id].site === site
    )
  },

  getBookmarkIdsWithTag: (state) => (tag) => {
    return state.tags[tag]
  },

  tagsCount: (state) => {
    return Object.entries(state.tags).map(([tag, bookmarkIds]) => [
      tag,
      bookmarkIds.length,
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
    const initialLoadNum = 50
    let getCountPromise = getCount()
    let fetchTopBookmarksPromise = fetchRecent(initialLoadNum)
    let fetchAllBookmarksPromise = fetchRecent(NUM_SYNC_BOOKMARKS)
    let headBookmarks = await fetchTopBookmarksPromise
    for (let bookmark of headBookmarks) {
      bookmark.id = bookmark.chrome_id
    }
    commit('SET_BOOKMARKS', { items: headBookmarks })
    let headIds = headBookmarks.map(({ id }) => id)
    commit('ADD_TO_BACK', { ids: headIds })
    Event.$emit('newItems')
    let countResponse = await getCountPromise
    commit('SET_BOOKMARKS_COUNT', {
      count: countResponse ? countResponse.count : 0,
    })
    let allBookmarks = await fetchAllBookmarksPromise
    let tailBookmarks = allBookmarks.slice(initialLoadNum)
    for (let bookmark of tailBookmarks) {
      bookmark.id = bookmark.chrome_id
    }
    commit('SET_BOOKMARKS', { items: tailBookmarks })
    let tailIds = tailBookmarks.map(({ id }) => id)
    commit('ADD_TO_BACK', { ids: tailIds })
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: allBookmarks.length })
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
      addTag(state, tag, id)
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
