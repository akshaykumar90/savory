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
      const [pageNo, num] = [page.value, itemsPerPage.value]
      const start = num * (pageNo - 1) + 1
      const end = start + num - 1

      const commonArgs = {
        ...(site.value && { site: site.value }),
        ...(tags.value.length && { tags: tags.value }),
        num,
      }
      if (search.value !== '') {
        const args = {
          ...commonArgs,
          query: search.value,
          skip: (pageNo - 1) * num,
        }
        resp = await ApiClient.searchBookmarks(args)
      } else {
        const args = {
          ...commonArgs,
          before: store.pageToBefore.get(pageNo),
        }
        resp = await ApiClient.getBookmarksWithTag(args)
      }

      const serverData = resp.data
      const maxPageNo = Math.ceil(serverData.total / num)

      return {
        ...serverData,
        page: pageNo,
        start,
        end: Math.min(end, serverData.total),
        hasNext: pageNo < maxPageNo,
        hasPrevious: pageNo > 1,
      }
    },
    {
      keepPreviousData: true,
      onSuccess: (data) => {
        let lastBookmarkDateAdded = data.bookmarks.at(-1).date_added
        store.savePosition(data.page + 1, lastBookmarkDateAdded)
        for (const bookmark of data.bookmarks) {
          queryClient.setQueryData(['bookmarks', bookmark.id], bookmark)
        }
      },
    }
  )
}
