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
      <div class="flex space-x-4">
        <span
          v-if="showClearFiltersButton"
          class="relative z-0 inline-flex rounded-md shadow-sm"
        >
          <button
            type="button"
            class="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
            @click="clearFilters"
          >
            <span class="sr-only">Clear filters</span>
            <XIcon class="h-5 w-5" aria-hidden="true" />
          </button>
        </span>
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
      </div>
    </nav>
  </div>
</template>

<script setup>
import { watch, ref, computed } from 'vue'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'
import { XIcon } from '@heroicons/vue/outline'

import { useRouter } from 'vue-router'
import useBookmarksPage from '../composables/useBookmarksPage'
import { usePageStore } from '../stores/page'

const router = useRouter()

const store = usePageStore()

const { isFetching, data } = useBookmarksPage()

const placemarkMessage = computed(() => {
  const totalItems = data.value.total
  if (totalItems === 0) {
    return 'Nothing to see here'
  }
  const itemsStr = totalItems > 1 ? 'bookmarks' : 'bookmark'
  if (data.value.tags.length > 0) {
    const tagsStr = data.value.tags.join(', ')
    return `${totalItems} ${itemsStr} in ${tagsStr}`
  } else if (data.value.site) {
    return `${totalItems} ${itemsStr} in ${data.value.site}`
  } else {
    return `${totalItems} ${itemsStr}`
  }
})

const showClearFiltersButton = computed(
  () => store.tags.length > 0 || store.site
)

function nextPage() {
  let cursor = data.value.cursor_info.next_cursor
  store.updateCursor(cursor, router)
}

function previousPage() {
  let cursor = data.value.cursor_info.previous_cursor
  store.updateCursor(cursor, router)
}

function clearFilters() {
  router.push('/')
}
</script>
