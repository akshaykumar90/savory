import { useQuery, useMutation, useQueryClient } from 'vue-query'
import { reactive } from 'vue'

export function useBookmark(bookmarkId) {
  const key = reactive(['bookmarks', bookmarkId])
  return useQuery(key, () => Promise.resolve({}), {
    staleTime: Infinity,
  })
}

export function useAddTag() {
  const queryClient = useQueryClient()

  return useMutation((values) => ApiClient.addTag(values), {
    onSuccess: (data, { bookmarkId, newTag }) => {
      const oldBookmark = queryClient.getQueryData(['bookmarks', bookmarkId])

      const updatedBookmark = {
        ...oldBookmark,
        tags: [...oldBookmark.tags, newTag],
      }
      queryClient.setQueryData(['bookmarks', bookmarkId], updatedBookmark)
    },
  })
}
