import { useQuery, useQueryClient } from 'vue-query'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { usePageStore } from '../stores/page'
import { fetchBookmarks } from '../lib/bookmarks'

export default function useBookmarksPage() {
  const queryClient = useQueryClient()
  const store = usePageStore()
  const { site, tags, search, cursor, itemsPerPage } = storeToRefs(store)

  const queryKey = reactive(['pages', { site, tags, search, cursor }])

  return useQuery(
    queryKey,
    () =>
      fetchBookmarks({
        site: site.value,
        tags: tags.value,
        search: search.value,
        cursor: cursor.value,
        itemsPerPage: itemsPerPage.value,
      }),
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        for (const bookmark of data.bookmarks) {
          queryClient.setQueryData(['bookmarks', bookmark.id], bookmark)
        }
      },
    }
  )
}
