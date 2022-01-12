import { useQuery } from 'vue-query'

export default function useBookmarks(routeName, routeQuery) {
  const key = [
    'bookmarks',
    {
      before: routeQuery.before,
    },
  ]
  return useQuery(key, () =>
    ApiClient.fetchRecent({
      num: 50,
      before: routeQuery.before,
    }).then((resp) => resp.data)
  )
}
