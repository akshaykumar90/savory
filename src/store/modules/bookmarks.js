import Vue from 'vue'
import {
  addTag as dbAddTag,
  deleteBookmarks,
  fetchRecent,
  getCount,
  removeTag as dbRemoveTag,
  setCount,
  getBookmarksWithTag,
  getTagsCount,
} from '../../api/mongodb'
import _ from 'lodash'
import { domainName } from '../../utils'

export const NUM_SYNC_BOOKMARKS = 7500

function addTag(state, tag) {
  if (!state.tags.hasOwnProperty(tag)) {
    Vue.set(state.tags, tag, 0)
  }
  state.tags[tag] += 1
}

function deleteTag(state, tag) {
  state.tags[tag] -= 1
  if (state.tags[tag] === 0) {
    Vue.delete(state.tags, tag)
  }
}

function newBookmark({ id, title, dateAdded, url, tags }) {
  return {
    id,
    title,
    dateAdded,
    url,
    site: domainName(url),
    tags,
    selected: false,
  }
}

function addBookmark(state, rawBookmark) {
  const { id, tags } = rawBookmark
  tags.forEach((t) => addTag(state, t))
  Vue.set(state.bookmarks, id, newBookmark(rawBookmark))
}

const state = () => ({
  isSynced: false,
  bookmarks: {
    /* [id: string]: Bookmark */
  },
  tags: {
    /* [name: string]: number */
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

  tagNames: (state) => {
    return Array.from(Object.keys(state.tags))
  },

  tagsCount: (state) => {
    return Object.entries(state.tags)
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
    if (state.isSynced) {
      return Promise.resolve()
    }
    const firstLoadNum = 50
    let getCountPromise = getCount()
    let getTagsCountPromise = getTagsCount()
    const fetchReqs = [
      fetchRecent({ num: firstLoadNum }),
      fetchRecent({ num: NUM_SYNC_BOOKMARKS }),
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
      let tagsCountResp = await getTagsCountPromise
      commit('SET_TAGS', { items: tagsCountResp })
    }
    commit('SET_BOOKMARKS_COUNT', { count: loadedCount })
    return Promise.resolve()
  },

  ON_BOOKMARK_CREATED: ({ state, commit }, { bookmark }) => {
    commit('ADD_BOOKMARK', bookmark)
    commit('ADD_TO_FRONT', { ids: [bookmark.id] })
    Event.$emit('newItems')
    commit('SET_BOOKMARKS_COUNT', { count: state.numBookmarks + 1 })
    return Promise.resolve()
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
    return deleteBookmarks({ bookmarkIds: currSelected })
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    commit('ADD_TAG', { id, tag })
    return dbAddTag({ bookmarkId: id, newTag: tag })
  },

  REMOVE_TAG_FROM_BOOKMARK: ({ commit }, { id, tag }) => {
    commit('REMOVE_TAG', { id, tag })
    return dbRemoveTag({ bookmarkId: id, tagToRemove: tag })
  },

  FETCH_BOOKMARK_IDS_WITH_TAG: ({ state }, { tags, site }) => {
    return getBookmarksWithTag({ tags, site }).then((result) => {
      return result.map(({ id }) => id)
    })
  },
}

const mutations = {
  SET_BOOKMARKS: (state, { items }) => {
    state.isSynced = true
    for (const rawBookmark of items) {
      const bookmark = newBookmark(rawBookmark)
      Vue.set(state.bookmarks, bookmark.id, bookmark)
    }
  },

  SET_TAGS: (state, { items }) => {
    for (const { tagName, count } of items) {
      Vue.set(state.tags, tagName, count)
    }
  },

  SET_BOOKMARKS_COUNT: (state, { count }) => {
    state.numBookmarks = count
  },

  ADD_BOOKMARK: (state, { id, title, dateAdded, url }) => {
    addBookmark(state, { id, title, dateAdded, url, tags: [] })
  },

  REMOVE_BOOKMARK: (state, { id: idToDelete }) => {
    let existingTags = state.bookmarks[idToDelete].tags
    existingTags.forEach((t) => deleteTag(state, t))
    Vue.delete(state.bookmarks, idToDelete)
  },

  ADD_TAG: (state, { id, tag }) => {
    if (!state.bookmarks[id].tags.includes(tag)) {
      addTag(state, tag)
      state.bookmarks[id].tags = [...state.bookmarks[id].tags, tag]
    }
  },

  REMOVE_TAG: (state, { id, tag: tagToRemove }) => {
    deleteTag(state, tagToRemove)
    let existingTags = state.bookmarks[id].tags
    state.bookmarks[id].tags = existingTags.filter((t) => t !== tagToRemove)
  },

  CLEAR_SELECTED: (state) => {
    _.forOwn(state.bookmarks, (val, id) => {
      state.bookmarks[id].selected = false
    })
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
