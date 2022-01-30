import { useQuery } from 'vue-query'
import { reactive } from 'vue'

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
