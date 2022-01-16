import _ from 'lodash'
import { defineStore } from 'pinia'

function getNormalizedPage(routeName, routeQuery) {
  const tags = !routeQuery.name
    ? []
    : Array.isArray(routeQuery.name)
    ? routeQuery.name
    : [routeQuery.name]
  return {
    site: routeQuery.site || '',
    tags,
    search: routeQuery.q || '',
    page: routeQuery.page ? Number(routeQuery.page) : 1,
  }
}

export const usePageStore = defineStore('page', {
  state: () => ({
    itemsPerPage: 100,
    site: '',
    tags: [],
    search: '',
    page: 1,
    pageToBefore: new Map(),
  }),
  getters: {
    before(state) {
      return state.pageToBefore.get(state.page)
    },
  },
  actions: {
    savePosition(page, position) {
      this.pageToBefore.set(page, position)
    },
    onRouteUpdate(newValues, oldValues) {
      const [newRouteName, newQuery] = newValues
      const [oldRouteName, oldQuery] = oldValues

      const [normalizedNew, normalizedOld] = [
        getNormalizedPage(newRouteName, newQuery),
        getNormalizedPage(oldRouteName, oldQuery),
      ]

      const { page: newPage, ...restOfNewRoute } = normalizedNew
      const { page: oldPage, ...restOfOldRoute } = normalizedOld

      let patch = normalizedNew

      if (!_.isEqual(restOfNewRoute, restOfOldRoute)) {
        patch.pageToBefore = new Map()
      }

      this.$patch(patch)
    },
  },
})
