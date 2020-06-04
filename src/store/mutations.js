import Vue from 'vue'
const { getDomain } = require('tldjs')

function domainName(bookmarkURL) {
  const url = new URL(bookmarkURL)
  // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
  return getDomain(url.hostname)
}

function scrubFromList(state, type, id) {
  let currList = state.lists[type]
  state.lists[type] = currList.filter((x) => x !== id)
}

function addBookmark(state, { id, title, dateAdded, url, tags }) {
  let site = domainName(url)
  tags.forEach((t) => addTag(state, t))
  let selected = false
  Vue.set(state.bookmarks, id, {
    id,
    title,
    dateAdded,
    url,
    site,
    tags,
    selected,
  })
}

function addTag(state, tag) {
  let count = state.tags[tag] || 0
  Vue.set(state.tags, tag, ++count)
}

function clearSelected(state) {
  _.forOwn(state.bookmarks, (val) => (val.selected = false))
}

function deleteTag(state, tag) {
  let count = state.tags[tag]
  if (--count === 0) {
    Vue.delete(state.tags, tag)
  } else {
    Vue.set(state.tags, tag, count)
  }
}

export default {
  SET_BOOKMARKS: (state, { items }) => {
    items.forEach((item) => addBookmark(state, item))
    let newIds = items.map(({ id }) => id)
    state.lists['new'] = [...state.lists['new'], ...newIds]
  },

  SET_BOOKMARKS_COUNT: (state, { count }) => {
    state.numBookmarks = count
  },

  ADD_BOOKMARK: (state, { id, title, dateAdded, url }) => {
    addBookmark(state, { id, title, dateAdded, url, tags: [] })
    state.lists['new'] = [id, ...state.lists['new']]
  },

  REMOVE_BOOKMARK: (state, { id: idToDelete }) => {
    let existingTags = state.bookmarks[idToDelete].tags
    existingTags.forEach((t) => deleteTag(state, t))
    Vue.delete(state.bookmarks, idToDelete)
    scrubFromList(state, 'new', idToDelete)
    scrubFromList(state, 'filtered', idToDelete)
  },

  SET_FILTERED: (state, ids) => {
    state.lists['filtered'] = ids
    state.page = 1
    state.activeType = 'filtered'
    clearSelected(state)
  },

  UPDATE_SEARCH_FILTER: (state, filter) => {
    state.filter = filter
  },

  CLEAR_FILTERED: (state) => {
    state.lists['filtered'] = []
    state.filter = { active: [], items: [] }
    state.activeType = 'new'
    state.page = 1
    clearSelected(state)
  },

  INCR_PAGE: (state) => {
    state.page += 1
  },

  SET_PAGE: (state, page) => {
    state.page = page
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

  UPDATE_IMPORT_PROGRESS: (state, { percent }) => {
    state.importPercent = percent
  },
}
