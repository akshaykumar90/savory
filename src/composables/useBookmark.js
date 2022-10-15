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
    }
  )
}

// The `useBookmark` composable is a hack, but it's a beautiful hack. This
// composable acts as an abstraction to lookup a bookmark id in the bookmarks
// cache maintained by vue-query.
//
// This composable takes `enabled` as an argument which allows call-sites to
// control if they want this query to fetch. This is needed because this
// composable can be used in a variety of places, including the bookmark rows
// themselves.
//
// We do not want every bookmark row retrieve the data themselves from the
// backend because we already have the data client-side in the form of an entire
// page of bookmarks. This is done in the `useBookmarksPage` composable.
// Individual rows fetching their own data also has the potential of causing a
// thundering herd at the backend which is never a good thing.
//
// In other places, in the edit tags component for example, it is desirable to
// fetch the latest data just for that bookmark. It is a necessity for this
// component if used outside the web app (e.g. in the extension) since there is
// no other composable fetching data on its behalf.
export function useBookmark({ bookmarkId, enabled }) {
  const key = ['bookmarks', bookmarkId]
  return useQuery(
    key,
    async () => {
      let resp = await ApiClient.getBookmark({ bookmark_id: bookmarkId })
      return resp.data
    },
    {
      enabled,
    }
  )
}
