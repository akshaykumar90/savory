import { useQuery } from 'vue-query'
import { reactive } from 'vue'

export function useBookmark(bookmarkId) {
  const key = reactive(['bookmarks', bookmarkId])
  return useQuery(key, () => Promise.resolve({}), {
    staleTime: Infinity,
  })
}