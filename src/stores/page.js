import { defineStore } from 'pinia'

// This is the source of truth for app navigation.
//
// This module has a listener for route changes which updates the internal state
// from route parameters. Queries (server state) are then listening to changes
// to this state. Therefore, the data flow is like this:
//
// user clicks around -> route updates -> page state changes -> queries fetch

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
    cursor: routeQuery.cursor || null,
  }
}

export const usePageStore = defineStore('page', {
  state: () => ({
    itemsPerPage: 100,
    ...getNormalizedPage(
      window.router.currentRoute.value.name,
      window.router.currentRoute.value.query
    ),
  }),
  actions: {
    onRouteUpdate(newValues) {
      const [newRouteName, newQuery] = newValues
      const normalizedPage = getNormalizedPage(newRouteName, newQuery)
      this.$patch(normalizedPage)
    },
  },
})
