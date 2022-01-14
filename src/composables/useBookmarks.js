import { useQuery } from 'vue-query'
import { reactive } from 'vue'

export default function useBookmarks(before) {
  const queryKey = reactive(['bookmarks', { before }])

  return useQuery(queryKey, () =>
    ApiClient.fetchRecent({
      num: 1,
      before: before.value,
    }).then((resp) => resp.data)
  )
}
