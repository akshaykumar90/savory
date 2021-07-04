import Vue from 'vue'
import { domainName } from '../../lib/utils'

function addTag(state, tag) {
  if (!state.tags.hasOwnProperty(tag)) {
    Vue.set(state.tags, tag, 0)
  }
  state.tags[tag] += 1
}

function deleteTag(state, tag) {
  if (state.tags.hasOwnProperty(tag)) {
    state.tags[tag] -= 1
    if (state.tags[tag] === 0) {
      Vue.delete(state.tags, tag)
    }
  }
}

// The input schema must match backend output schema
function newBookmark({ id, title, date_added, url, tags }) {
  return {
    id,
    title,
    dateAdded: date_added,
    url,
    site: domainName(url),
    tags,
    selected: false,
  }
}

const state = () => ({
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
  tagsCount: (state) => {
    return Object.entries(state.tags)
  },
}

const actions = {
  BULK_DELETE_BOOKMARKS: async (
    { state, commit, dispatch },
    { ids: currSelected }
  ) => {
    await dispatch('SCRUB_LISTS', { ids: currSelected })
    currSelected.map((id) => commit('REMOVE_BOOKMARK', { id }))
    commit('SET_BOOKMARKS_COUNT', {
      count: state.numBookmarks - currSelected.length,
    })
    return ApiClient.deleteBookmarks({ bookmarkIds: currSelected })
  },

  ADD_TAG_FOR_BOOKMARK: ({ commit }, { id, tag }) => {
    commit('ADD_TAG', { id, tag })
    return ApiClient.addTag({ bookmarkId: id, newTag: tag })
  },

  ADD_TAG_MANY: ({ commit }, { ids, tag }) => {
    for (const id of ids) {
      commit('ADD_TAG', { id, tag })
    }
    return ApiClient.bulkAddTag({ bookmarkIds: ids, newTag: tag })
  },

  REMOVE_TAG_FROM_BOOKMARK: ({ commit }, { id, tag }) => {
    commit('REMOVE_TAG', { id, tag })
    return ApiClient.removeTag({ bookmarkId: id, tagToRemove: tag })
  },

  REMOVE_TAG_MANY: ({ commit }, { ids, tag }) => {
    for (const id of ids) {
      commit('REMOVE_TAG', { id, tag })
    }
    return ApiClient.bulkRemoveTag({ bookmarkIds: ids, tagToRemove: tag })
  },

  FETCH_TAGS_COUNT: ({ commit }) => {
    return ApiClient.getTagsCount().then((resp) => {
      commit('SET_TAGS', { items: resp.data })
    })
  },

  FETCH_BOOKMARKS: ({ commit }, { num, before }) => {
    return ApiClient.fetchRecent({ num, before }).then((resp) => {
      commit('SET_BOOKMARKS', { items: resp.data.bookmarks })
      commit('SET_BOOKMARKS_COUNT', { count: resp.data.total })
      return resp.data
    })
  },

  FETCH_BOOKMARKS_WITH_TAG: ({ commit }, { tags, site, num, before }) => {
    return ApiClient.getBookmarksWithTag({ tags, site, num, before }).then(
      (resp) => {
        commit('SET_BOOKMARKS', { items: resp.data.bookmarks })
        return resp.data
      }
    )
  },

  FETCH_BOOKMARKS_WITH_QUERY: (
    { commit },
    { query, num, skip, site, tags }
  ) => {
    return ApiClient.searchBookmarks({ query, num, skip, site, tags }).then(
      (resp) => {
        commit('SET_BOOKMARKS', { items: resp.data.bookmarks })
        return resp.data
      }
    )
  },
}

const mutations = {
  SET_BOOKMARKS: (state, { items }) => {
    for (const rawBookmark of items) {
      const bookmark = newBookmark(rawBookmark)
      Vue.set(state.bookmarks, bookmark.id, bookmark)
    }
  },

  SET_TAGS: (state, { items }) => {
    for (const { name, count } of items) {
      Vue.set(state.tags, name, count)
    }
  },

  SET_BOOKMARKS_COUNT: (state, { count }) => {
    state.numBookmarks = count
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
    let existingTags = state.bookmarks[id].tags
    // Need to check due to how bulk operations work
    if (existingTags.includes(tagToRemove)) {
      deleteTag(state, tagToRemove)
      state.bookmarks[id].tags = existingTags.filter((t) => t !== tagToRemove)
    }
  },

  SET_SELECTED: (state, { ids, isChecked }) => {
    for (const id of ids) {
      // The bookmark might already be nuked by the time we get to this commit.
      // It becomes a no-op then.
      if (state.bookmarks.hasOwnProperty(id)) {
        state.bookmarks[id].selected = isChecked
      }
    }
  },
}

export default {
  state,
  getters,
  actions,
  mutations,
}
