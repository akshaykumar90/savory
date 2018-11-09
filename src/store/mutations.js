import Vue from 'vue'

export default {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach(({ id, title, url, tags }) => {
      Vue.set(state.bookmarks, id, { id, title, site:url, tags })
    })
  },

  SET_RECENT: (state, ids) => {
    state.recent = ids
  },
}
