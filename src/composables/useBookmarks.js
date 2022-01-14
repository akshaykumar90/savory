import { useQuery } from 'vue-query'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { usePageStore } from '../stores/page'

export default function useBookmarks() {
  const store = usePageStore()
  const { page, itemsPerPage } = storeToRefs(store)
  const queryKey = reactive(['bookmarks', { page }])

  return useQuery(
    queryKey,
    () =>
      ApiClient.fetchRecent({
        num: itemsPerPage.value,
        before: store.before,
      }).then((resp) => resp.data),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        let lastBookmarkDateAdded = data.bookmarks.at(-1).date_added
        store.savePosition(store.page + 1, lastBookmarkDateAdded)
        store.total = data.total
      },
    }
  )
}
