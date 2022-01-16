<template>
  <div>
    <nav
      class="bg-white py-3 flex mx-3 gap-4 items-center justify-between"
      aria-label="Pagination"
    >
      <div>
        <p class="text-sm text-gray-700" v-if="data">
          <span class="font-medium">{{ store.start }}</span>
          {{ ' - ' }}
          <span class="font-medium">{{ store.end }}</span>
          {{ ' ' }}
          of
          {{ ' ' }}
          <span v-if="data" class="font-medium">{{ store.total }}</span>
        </p>
      </div>
      <span class="relative z-0 inline-flex shadow-sm rounded-md">
        <button
          type="button"
          class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          @click="previousPage"
        >
          <span class="sr-only">Previous</span>
          <ChevronLeftIcon class="h-5 w-5" aria-hidden="true" />
        </button>
        <button
          type="button"
          class="-ml-px relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
          @click="nextPage"
        >
          <span class="sr-only">Next</span>
          <ChevronRightIcon class="h-5 w-5" aria-hidden="true" />
        </button>
      </span>
    </nav>
  </div>
</template>

<script setup>
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/vue/solid'

import { useRoute, useRouter } from 'vue-router'
import useBookmarksPage from '../composables/useBookmarksPage'
import { usePageStore } from '../stores/page'

const route = useRoute()
const router = useRouter()

const store = usePageStore()

const { data } = useBookmarksPage()

function nextPage() {
  if (store.hasNext) {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        page: store.page + 1,
      },
    })
  }
}

function previousPage() {
  if (store.hasPrevious) {
    router.push({
      name: route.name,
      query: {
        ...route.query,
        page: store.page - 1,
      },
    })
  }
}
</script>
