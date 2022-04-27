import { useMutation, useQuery, useQueryClient } from 'vue-query'
import { reactive } from 'vue'

export function useDeleteBookmarks() {
  const queryClient = useQueryClient()

  return useMutation(
    ({ bookmarkIds }) => ApiClient.deleteBookmarks({ bookmarkIds }),
    {
      onMutate: ({ bookmarkIds }) => {
        // Optimistic update
        queryClient.setQueriesData(
          { queryKey: 'pages', active: true },
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

export function useBookmark(bookmarkId) {
  const key = reactive(['bookmarks', bookmarkId])
  return useQuery(
    key,
    async () => {
      let resp = await ApiClient.getBookmark({ bookmark_id: bookmarkId })
      return resp.data
    },
    {
      staleTime: Infinity,
    }
  )
}
