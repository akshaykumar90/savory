import Vue from 'vue'

function domainName (bookmarkURL) {
  const url = new URL(bookmarkURL);
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return url.hostname.split('.').splice(-2, 2).join('.')
}

function scrubFromList (state, type, id) {
  let index = state.lists[type].indexOf(id)
  if (index !== -1) {
    state.lists[type] = [
      ...state.lists[type].slice(0, index),
      ...state.lists[type].slice(index + 1)
    ]
  }
}

export default {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach(({ id, title, url, tags }) => {
      let site = domainName(url)
      Vue.set(state.bookmarks, id, { id, title, url, site, tags })
    })
    state.lists['new'] = items.map(({ id }) => id)
  },

  ADD_BOOKMARK: (state, { id, title, url }) => {
    let site = domainName(url)
    Vue.set(state.bookmarks, id, { id, title, url, site, tags:[] })
    state.lists['new'] = [id, ...state.lists['new']]
  },

  REMOVE_BOOKMARK: (state, { id: idToDelete }) => {
    Vue.delete(state.bookmarks, idToDelete)
    scrubFromList(state, 'new', idToDelete)
    scrubFromList(state, 'filtered', idToDelete)
  },

  SET_FILTERED: (state, ids) => {
    state.lists['filtered'] = ids
    state.activeType = 'filtered'
    state.page = 1
  },

  SET_SEARCH_FILTERS: (state, items) => {
    state.filters = items
  },

  CLEAR_FILTERED: (state) => {
    state.filtered = []
    state.activeType = 'new'
    state.page = 1
  },

  INCR_PAGE: (state) => {
    state.page += 1
  },

  UPDATE_TAGS: (state, { id, tags }) => {
    state.bookmarks[id].tags = tags
  }
}
