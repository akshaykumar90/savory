import Vue from 'vue'

export default {
  SET_BOOKMARKS: (state, { items }) => {
    state.new = []
    items.forEach(({ id, title, url, tags }) => {
      Vue.set(state.bookmarks, id, { id, title, site:url, tags })
      state.new.push(id)
    })
  },

  ADD_BOOKMARK: (state, { id, title, url }) => {
    Vue.set(state.bookmarks, id, { id, title, site:url, tags:[] })
    state.new.unshift(id)
  },

  SET_FILTERED: (state, ids) => {
    state.filtered = ids
  },

  CLEAR_FILTERED: (state) => {
    state.filtered = []
  },

  UPDATE_TAGS: (state, { id, tags }) => {
    state.bookmarks[id].tags = tags
  }
}
