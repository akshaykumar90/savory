import Vue from 'vue'

export default {
  SET_BOOKMARKS: (state, { items }) => {
    state.new = []
    items.forEach(({ id, title, url, tags }) => {
      Vue.set(state.bookmarks, id, { id, title, site:url, tags })
      state.new.push(id)
    })
  },

  SET_CURRENT: (state, ids) => {
    state.current = ids
  },

  UPDATE_TAGS: (state, { id, tags }) => {
    state.bookmarks[id].tags = tags
  }
}
