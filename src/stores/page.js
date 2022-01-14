import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
  state: () => ({
    itemsPerPage: 100,
    page: 1,
    total: 0,
    pageToBefore: {},
  }),
  getters: {
    before(state) {
      return state.pageToBefore[state.page]
    },
    maxPage(state) {
      return Math.ceil(state.total / state.itemsPerPage)
    },
    start(state) {
      return state.total && state.itemsPerPage * (state.page - 1) + 1
    },
    end(state) {
      return Math.min(this.start + state.itemsPerPage - 1, state.total)
    },
    hasNext(state) {
      return state.page < this.maxPage
    },
    hasPrevious(state) {
      return state.page > 1
    },
  },
  actions: {
    savePosition(page, position) {
      this.pageToBefore[page] = position
    },
  },
})
