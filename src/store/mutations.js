import Vue from 'vue'

export default {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach(({ id, title, url, tags }) => {
      Vue.set(state.bookmarks, id, { id, title, site:url, tags })
    })
    state.new = items.map(({ id }) => id)
  },

  ADD_BOOKMARK: (state, { id, title, url }) => {
    Vue.set(state.bookmarks, id, { id, title, site:url, tags:[] })
    state.new = [id, ...state.new]
  },

  REMOVE_BOOKMARK: (state, { id: idToDelete }) => {
    Vue.delete(state.bookmarks, idToDelete)
    let index = state.new.indexOf(idToDelete);
    state.new = [
      ...state.new.slice(0, index),
      ...state.new.slice(index + 1)
    ]
    let indexInFiltered = state.filtered.indexOf(idToDelete)
    if (indexInFiltered !== -1) {
      state.filtered = [
        ...state.filtered.slice(0, indexInFiltered),
        ...state.filtered.slice(indexInFiltered + 1)
      ]
    }
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
