import { defineStore } from 'pinia'

export const useSelectedStore = defineStore('selected', {
  state: () => ({
    selectedIds: new Set(),
  }),
  getters: {
    isBookmarkSelected: (state) => {
      return (bookmarkId) => state.selectedIds.has(bookmarkId)
    },
  },
  actions: {
    add(bookmarkId) {
      this.selectedIds.add(bookmarkId)
    },
    remove(bookmarkId) {
      this.selectedIds.delete(bookmarkId)
    },
  },
})
