import _ from 'lodash'

export default {
  maxPage (state) {
    const { activeType, itemsPerPage, lists } = state
    return Math.ceil(lists[activeType].length / itemsPerPage)
  },

  activeIds (state) {
    const { activeType, itemsPerPage, page, lists } = state

    // const start = (page - 1) * itemsPerPage
    const end = page * itemsPerPage

    return lists[activeType].slice(0 /* start */, end)
  },

  getBookmarkById: (state) => (id) => {
    return state.bookmarks[id]
  },

  getBookmarkIdsWithSite: (state) => (site) => {
    return state.lists['new'].filter(id => state.bookmarks[id].site === site)
  },

  tagsJson (state) {
    let tags = _.values(state.bookmarks)
      .filter(({ tags }) => tags.length)
      .map(({ url, tags }) => { return { url, tags } })
    return JSON.stringify({'tags': tags})
  },

  numBookmarks (state, getters) {
    const { activeType, lists } = state
    if (activeType === 'new') {
      return state.numBookmarks
    } else {
      return lists[activeType].length
    }
  },
}
