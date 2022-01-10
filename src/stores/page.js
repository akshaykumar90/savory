import { defineStore } from 'pinia'

export const usePageStore = defineStore('page', {
  state: () => ({
    itemsPerPage: 100,
    page: 1,
    total: 200,
  }),
  getters: {
    start(state) {
      return state.itemsPerPage * (state.page - 1) + 1
    },
    end(state) {
      return this.start + state.itemsPerPage - 1
    },
  },
  actions: {
    next() {
      this.page++
    },
    previous() {
      this.page--
    },
  },
})
