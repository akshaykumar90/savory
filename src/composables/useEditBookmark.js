import { useBookmark } from './useBookmark'
import { computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'

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
  })
}

function useRemoveTag() {
  const queryClient = useQueryClient()

  return useMutation((values) => ApiClient.removeTag(values), {
    onMutate: ({ bookmarkId, tagToRemove }) => {
      const queryKey = ['bookmarks', bookmarkId]
      const oldValue = queryClient.getQueryData(queryKey)

      // Optimistic update
      queryClient.setQueryData(queryKey, (old) => {
        return {
          ...old,
          tags: old.tags.filter((t) => t !== tagToRemove),
        }
      })

      return () => queryClient.setQueryData(queryKey, oldValue)
    },
    onError: (error, variables, rollback) => {
      if (rollback) {
        rollback()
      }
    },
  })
}

export default function useEditBookmark(bookmarkId) {
  const { data } = useBookmark(bookmarkId)
  const tags = computed(() => data.value && data.value.tags)
  const addTagMutation = useAddTag()
  const addTag = (newTag) =>
    addTagMutation.mutate({
      bookmarkId,
      newTag,
    })
  const removeTagMutation = useRemoveTag()
  const removeTag = (tagToRemove) =>
    removeTagMutation.mutate({
      bookmarkId,
      tagToRemove,
    })
  return {
    tags,
    addTag,
    removeTag,
  }
}
