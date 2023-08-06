import { useQuery, useQueryClient } from '@tanstack/vue-query'
import { storeToRefs } from 'pinia'

import { usePageStore } from '../stores/page'
import { fetchBookmarks } from '../lib/bookmarks'
import { computed } from 'vue'

export default function useBookmarksPage() {
  const queryClient = useQueryClient()
  const store = usePageStore()
  const { site, tags, search, cursor, untagged, itemsPerPage } =
    storeToRefs(store)

  const queryKey = ['pages', { site, tags, search, untagged, cursor }]

  return useQuery(
    queryKey,
    () =>
      fetchBookmarks({
        site: site.value,
        tags: tags.value,
        search: search.value,
        cursor: cursor.value,
        untagged: untagged.value,
        itemsPerPage: itemsPerPage.value,
      }),
    {
      retry: 1,
      keepPreviousData: true,
      // Search results are ordered by search ranking which may change
      // unpredictably between refetches, e.g. if new tags were added to some
      // bookmarks on the page. Therefore, we disable refetching on window focus
      // only for search results page.
      refetchOnWindowFocus: computed(() => !search.value),
      onSuccess: (data) => {
        for (const bookmark of data.bookmarks) {
          queryClient.setQueryData(['bookmarks', bookmark.id], bookmark)
        }
      },
    }
  )
}
