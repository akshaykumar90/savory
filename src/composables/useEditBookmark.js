import { useBookmark } from './useBookmark'
import { computed } from 'vue'
import { useMutation, useQueryClient } from 'vue-query'

function useAddTag() {
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
