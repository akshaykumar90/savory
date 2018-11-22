import Vue from 'vue'

function domainName (bookmarkURL) {
  const url = new URL(bookmarkURL);
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return url.hostname.split('.').splice(-2, 2).join('.')
}

export default {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach(({ id, title, url, tags }) => {
      let site = domainName(url)
      Vue.set(state.bookmarks, id, { id, title, url, site, tags })
    })
    state.new = items.map(({ id }) => id)
  },

  ADD_BOOKMARK: (state, { id, title, url }) => {
    let site = domainName(url)
    Vue.set(state.bookmarks, id, { id, title, url, site, tags:[] })
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
