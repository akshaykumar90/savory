<template>
  <div>
    <nav
      class="mx-3 flex items-center justify-between gap-4 bg-white py-3"
      aria-label="Pagination"
    >
      <div>
        <p class="text-sm text-gray-700" v-if="data">
          <span class="font-medium">{{ placemarkMessage }}</span>
        </p>
      </div>
      <span class="relative z-0 inline-flex rounded-md shadow-sm">
        <button
          type="button"
          class="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          @click="previousPage"
          :disabled="isFetching || !data.cursor_info.has_previous_page"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          @click="nextPage"
          :disabled="isFetching || !data.cursor_info.has_next_page"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </span>
    </nav>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

import { useRouter } from 'vue-router'
import useBookmarksPage from '../composables/useBookmarksPage'
import { usePageStore } from '../stores/page'

const router = useRouter()

const store = usePageStore()

const { isFetching, data } = useBookmarksPage()

// TODO: This computed property unfortunately is tracking changes to both `data`
// and `store`. This means that since we update the route (and therefore the
// `store`) before data fetch completes, this property is computed twice and
// leads to a flash of incorrect string.
//
// Example: When you click on the "watching" tag, it will first flash "7988
// bookmarks in watching" and then when data load finishes, it will settle on
// the real string "110 bookmarks in watching". Please fix!
const placemarkMessage = computed(() => {
  if (!data) {
    return ''
  }
  const totalItems = data.value.total
  const itemsStr = totalItems > 1 ? 'bookmarks' : 'bookmark'
  if (store.tags.length > 0) {
    const tagsStr = store.tags.join(', ')
    return `${totalItems} ${itemsStr} in ${tagsStr}`
  }
  if (store.site) {
    return `${totalItems} ${itemsStr} in ${store.site}`
  }
  return `${totalItems} ${itemsStr}`
})

function nextPage() {
  let cursor = data.value.cursor_info.next_cursor
  store.updateCursor(cursor, router)
}

function previousPage() {
  let cursor = data.value.cursor_info.previous_cursor
  store.updateCursor(cursor, router)
}
</script>
