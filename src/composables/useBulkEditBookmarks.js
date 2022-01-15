import { useSelectionStore } from '../stores/selection'
import { useBookmark } from './useBookmark'
import { computed } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'

function useBulkAddTag() {
  const queryClient = useQueryClient()

  const updateCache = (bookmarkId, newTag) => {
    const oldBookmark = queryClient.getQueryData(['bookmarks', bookmarkId])

    const updatedBookmark = {
      ...oldBookmark,
      tags: [...oldBookmark.tags, newTag],
    }
    queryClient.setQueryData(['bookmarks', bookmarkId], updatedBookmark)
  }

  return useMutation((values) => ApiClient.bulkAddTag(values), {
    onSuccess: (data, { bookmarkIds, newTag }) => {
      bookmarkIds.forEach((bookmarkId) => updateCache(bookmarkId, newTag))
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
    let tags = []
    for (let data of arr) {
      tags = tags.concat(data.value.tags)
    }
    let setUnion = Array.from(new Set(tags))
    return setUnion.sort()
  })
  const addTagMutation = useBulkAddTag()
  const addTag = (newTag) =>
    addTagMutation.mutate({
      bookmarkIds: Array.from(store.selectedIds),
      newTag,
    })
  return {
    tags: allTags,
    addTag,
  }
}
