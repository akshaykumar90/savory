import { useBookmark } from './useBookmark'
import { computed } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'

function useAddTag() {
  const queryClient = useQueryClient()

  return useMutation((values) => ApiClient.addTag(values), {
    onMutate: ({ bookmarkId, newTag }) => {
      const queryKey = ['bookmarks', bookmarkId]
      const oldValue = queryClient.getQueryData(queryKey)

      // Optimistic update
      queryClient.setQueryData(queryKey, (old) => {
        return {
          ...old,
          tags: [...old.tags, newTag],
        }
      })

      return () => queryClient.setQueryData(queryKey, oldValue)
    },
    onError: (error, variables, rollback) => {
      if (rollback) {
        rollback()
      }
    },
    onSettled: (data, error, { bookmarkId }) => {
      queryClient.invalidateQueries(['bookmarks', bookmarkId])
    },
  })
}

export default function useEditBookmark(bookmarkId) {
  const { data } = useBookmark(bookmarkId)
  const tags = computed(() => data.value.tags)
  const addTagMutation = useAddTag()
  const addTag = (newTag) =>
    addTagMutation.mutate({
      bookmarkId,
      newTag,
    })
  return {
    tags,
    addTag,
  }
}
