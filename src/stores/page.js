// This store is the source of truth for app navigation.
//
// There are two listeners defined under `actions`.
//
// - onBeforeRouteUpdate
//
//   When the user clicks something to begin a navigation, this handler fires
//   first and receives the next route. We begin loading the next page of data
//   in this step (if it's not already available in the query cache). We do not
//   block on this step, instead the route updates immediately after this
//   function is done, that's why this is the "before" route update handler.
//
//   As a (very important) side effect, we save the promise returned by the
//   `fetchQuery` on the store, which is then used by a custom scroll handler
//   to wait on before scrolling up. This improves the user experience because
//   otherwise we would have scrolled up immediately on clicking a new tag and
//   user would see a flash of old data before it's replaced by new data.
//
// - onRouteUpdate
//
//   This handler fires after the route has been updated. It patches the local
//   store state to reflect new values extracted from the route. Vue queries
//   are listening to changes to this state and therefore any component using
//   those queries will now refresh to show new data as soon as it's available.
//
// Therefore, data flow is something like this:
//
// user clicks something -> start fetching data for route -> route updates ->
// page state changes -> queries fetch (but sharing the cache, so no duplicate
// requests) -> new data is rendered -> scroll to top

import { defineStore } from 'pinia'
import { fetchBookmarks } from '../lib/bookmarks'
import { useSelectionStore } from './selection'
import _ from 'lodash'

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
    itemsPerPage: 10,
    fetchPromise: Promise.resolve({}),
    ...getNormalizedPage(
      window.router.currentRoute.value.name,
      window.router.currentRoute.value.query
    ),
  }),
  actions: {
    onRouteUpdate(newRoute) {
      const store = useSelectionStore()
      const newPage = getNormalizedPage(newRoute.name, newRoute.query)
      const sameSite = newPage.site === this.site
      // We cannot directly compare `this.tags` here because it is actually a
      // proxy created by the Vue reactivity system
      const sameTags = _.isEqual(newPage.tags, Array.from(this.tags))
      const sameSearchQuery = newPage.search === this.search

      if (!sameSite || !sameTags || !sameSearchQuery) {
        store.clear()
      }

      this.$patch(newPage)
    },
    onBeforeRouteUpdate(newRoute, queryClient) {
      let queryParams = getNormalizedPage(newRoute.name, newRoute.query)
      const queryKey = ['pages', queryParams]
      this.fetchPromise = queryClient.getQueryData(queryKey)
        ? Promise.resolve({})
        : queryClient
            .fetchQuery(queryKey, () =>
              fetchBookmarks({
                ...queryParams,
                itemsPerPage: this.itemsPerPage,
              })
            )
            .then(() => ({}))
    },
    updateCursor(cursor, router) {
      let path = router.currentRoute.value.path
      router.push({
        path,
        query: {
          ...(this.site && { site: this.site }),
          ...(this.tags.length && { name: this.tags }),
          ...(this.search && { q: this.search }),
          ...(cursor && { cursor }),
        },
      })
    },
    updateSearch(query, router) {
      router.push({
        path: '/search',
        query: {
          ...(this.site && { site: this.site }),
          ...(this.tags.length && { name: this.tags }),
          ...(query && { q: query }),
        },
      })
    },
  },
})
