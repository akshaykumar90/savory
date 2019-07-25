import Vue from 'vue'

function domainName (bookmarkURL) {
  const url = new URL(bookmarkURL);
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return url.hostname.split('.').splice(-2, 2).join('.')
}

function scrubFromList (state, type, id) {
  let currList = state.lists[type]
  state.lists[type] = currList.filter(x => x !== id)
}

export default {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach(({ id, title, dateAdded, url, tags }) => {
      let site = domainName(url)
      Vue.set(state.bookmarks, id, { id, title, dateAdded, url, site, tags })
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

  SET_LISTICLE: (state, listicle) => {
    Vue.set(state.listicles, listicle.id, listicle)
  },

  SWITCH_TO_LISTICLE_VIEW: (state, listId) => {
    state.activeListicleId = listId
    state.activeType = 'listicle'
  },

  SET_FILTERED: (state, ids) => {
    state.lists['filtered'] = ids
    state.activeType = 'filtered'
    state.page = 1
  },

  UPDATE_SEARCH_FILTER: (state, filter) => {
    state.filter = filter
  },

  CLEAR_FILTERED: (state) => {
    state.lists['filtered'] = []
    state.filter = { active: [], items: [] }
    state.activeType = 'new'
    state.page = 1
  },

  INCR_PAGE: (state) => {
    state.page += 1
  },

  SET_TAGS: (state, { id, tags }) => {
    state.bookmarks[id].tags = tags
  },

  ADD_TAG: (state, { id, tags }) => {
    // Multiple tags can be added together
    state.bookmarks[id].tags = [...state.bookmarks[id].tags, ...tags]
  },

  REMOVE_TAG: (state, { id, tag: tagToRemove }) => {
    let existingTags = state.bookmarks[id].tags
    state.bookmarks[id].tags = existingTags.filter(t => t !== tagToRemove)
  }
}
