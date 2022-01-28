import { useQuery, useQueryClient } from 'vue-query'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { usePageStore } from '../stores/page'

export default function useBookmarksPage() {
  const queryClient = useQueryClient()
  const store = usePageStore()
  const { site, tags, search, cursor, itemsPerPage } = storeToRefs(store)

  const queryKey = reactive(['pages', { site, tags, search, cursor }])

  return useQuery(
    queryKey,
    async () => {
      let resp
      const num = itemsPerPage.value

      const commonArgs = {
        ...(site.value && { site: site.value }),
        ...(tags.value.length && { tags: tags.value }),
        ...(cursor.value && { cursor: cursor.value }),
        num,
      }
      if (search.value !== '') {
        const args = {
          ...commonArgs,
          query: search.value,
        }
        resp = await ApiClient.searchBookmarks(args)
      } else {
        resp = await ApiClient.getBookmarks(commonArgs)
      }

      return resp.data
    },
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
