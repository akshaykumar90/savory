import { defineStore } from 'pinia'

export const useSelectionStore = defineStore('selected', {
  state: () => ({
    selectedIds: new Set(),
  }),
  actions: {
    add(bookmarkId) {
      this.selectedIds.add(bookmarkId)
    },
    remove(bookmarkId) {
      this.selectedIds.delete(bookmarkId)
    },
    removeMultiple(bookmarkIds) {
      bookmarkIds.forEach((x) => this.remove(x))
    },
    clear() {
      this.selectedIds.clear()
    },
  },
})
