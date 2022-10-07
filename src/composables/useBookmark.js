import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export function useDeleteBookmarks() {
  const queryClient = useQueryClient()

  return useMutation(
    ({ bookmarkIds }) => ApiClient.deleteBookmarks({ bookmarkIds }),
    {
      onMutate: ({ bookmarkIds }) => {
        // Optimistic update
        queryClient.setQueriesData(
          { queryKey: ['pages'], type: 'active' },
          (old) => {
            return {
              ...old,
              total: old.total - bookmarkIds.length,
              bookmarks: old.bookmarks.filter(
                (b) => !bookmarkIds.includes(b.id)
              ),
            }
          }
        )
      },
      onSettled: () => {
        queryClient.invalidateQueries(['pages'])
      },
    }
  )
}

// The `useBookmark` composable is a hack, but it's a beautiful hack. This
// composable acts as an abstraction to lookup a bookmark id in the bookmarks
// cache maintained by vue-query.
//
// We never want to individually retrieve a bookmark row from the backend
// because we already have the data client-side in the form of an entire page of
// bookmarks. Individual rows fetching their own data also has the potential of
// causing a thundering herd at the backend which is never a good thing.
//
// To avoid ever fetching data, we have set `enabled` to false. This ensures
// that this query will never automatically fetch on mount or automatically
// refetch in the background. Instead, data for this query is set manually in
// the `useBookmarksPage` composable.
export function useBookmark(bookmarkId) {
  const key = ['bookmarks', bookmarkId]
  return useQuery(
    key,
    async () => {
      let resp = await ApiClient.getBookmark({ bookmark_id: bookmarkId })
      return resp.data
    },
    {
      enabled: false,
    }
  )
}
