import { useQuery, useQueryClient } from 'vue-query'
import { reactive } from 'vue'
import { storeToRefs } from 'pinia'

import { usePageStore } from '../stores/page'

export default function useBookmarksPage() {
  const queryClient = useQueryClient()
  const store = usePageStore()
  const { site, tags, search, page, itemsPerPage } = storeToRefs(store)

  const queryKey = reactive(['pages', { site, tags, search, num: page }])

  return useQuery(
    queryKey,
    async () => {
      let resp
      const commonArgs = {
        ...(site.value && { site: site.value }),
        ...(tags.value.length && { tags: tags.value }),
        num: itemsPerPage.value,
      }
      if (search.value !== '') {
        const args = {
          ...commonArgs,
          query: search.value,
          skip: (page.value - 1) * itemsPerPage.value,
        }
        resp = await ApiClient.searchBookmarks(args)
      } else {
        const args = {
          ...commonArgs,
          before: store.before,
        }
        resp = await ApiClient.getBookmarksWithTag(args)
      }
      return resp.data
    },
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        let lastBookmarkDateAdded = data.bookmarks.at(-1).date_added
        store.savePosition(store.page + 1, lastBookmarkDateAdded)
        store.total = data.total
        for (const bookmark of data.bookmarks) {
          queryClient.setQueryData(['bookmarks', bookmark.id], bookmark)
        }
      },
    }
  )
}
