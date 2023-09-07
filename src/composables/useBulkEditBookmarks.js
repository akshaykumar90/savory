import { useSelectionStore } from '../stores/selection'
import { useBookmark } from './useBookmark'
import { computed } from 'vue'
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { flattenTags } from '../lib/tagsRow'

function useBulkAddTag() {
  const queryClient = useQueryClient()

  const updateCache = (queryKey, newTag) => {
    queryClient.setQueryData(queryKey, (old) => {
      return {
        ...old,
        tags: [...old.tags, newTag],
      }
    })
  }

  return useMutation((values) => ApiClient.bulkAddTag(values), {
    onMutate: ({ bookmarkIds, newTag }) => {
      let oldValues = []
      bookmarkIds.forEach((bookmarkId) => {
        const queryKey = ['bookmarks', bookmarkId]
        oldValues.push(queryClient.getQueryData(queryKey))
        // Optimistic updates
        updateCache(queryKey, newTag)
      })

      return () => {
        oldValues.forEach((oldValue) => {
          const queryKey = ['bookmarks', oldValue.id]
          queryClient.setQueryData(queryKey, oldValue)
        })
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) {
        rollback()
      }
    },
  })
}

function useBulkRemoveTag() {
  const queryClient = useQueryClient()

  const updateCache = (queryKey, tagToRemove) => {
    queryClient.setQueryData(queryKey, (old) => {
      return {
        ...old,
        tags: old.tags.filter((t) => t !== tagToRemove),
      }
    })
  }

  return useMutation((values) => ApiClient.bulkRemoveTag(values), {
    onMutate: ({ bookmarkIds, tagToRemove }) => {
      let oldValues = []
      bookmarkIds.forEach((bookmarkId) => {
        const queryKey = ['bookmarks', bookmarkId]
        oldValues.push(queryClient.getQueryData(queryKey))
        // Optimistic updates
        updateCache(queryKey, tagToRemove)
      })

      return () => {
        oldValues.forEach((oldValue) => {
          const queryKey = ['bookmarks', oldValue.id]
          queryClient.setQueryData(queryKey, oldValue)
        })
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) {
        rollback()
      }
    },
  })
}

export default function useBulkEditBookmarks() {
  const store = useSelectionStore()
  let arr = Array.from(store.selectedIds).map((bookmarkId) => {
    const { data } = useBookmark(bookmarkId)
    return data
  })
  const allTags = computed(() => {
    let tagsList = arr.map((data) => data.value.tags)
    return flattenTags(tagsList)
  })
  const addTagMutation = useBulkAddTag()
  const addTag = (newTag) =>
    addTagMutation.mutate({
      bookmarkIds: Array.from(store.selectedIds),
      newTag,
    })
  const removeTagMutation = useBulkRemoveTag()
  const removeTag = (tagToRemove) =>
    removeTagMutation.mutate({
      bookmarkIds: Array.from(store.selectedIds),
      tagToRemove,
    })
  return {
    tags: allTags,
    addTag,
    removeTag,
  }
}
