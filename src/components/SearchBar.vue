<template>
  <div class="flex flex-1 justify-center lg:justify-end">
    <div class="w-full px-2 lg:px-6">
      <label for="search" class="sr-only">Search bookmarks</label>
      <div class="text-black-200 relative h-[46px] focus-within:text-gray-400">
        <div
          class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3"
        >
          <MagnifyingGlassIcon class="h-5 w-5" aria-hidden="true" />
        </div>
        <input
          type="text"
          placeholder="Search bookmarks"
          autocomplete="off"
          spellcheck="false"
          id="search"
          name="search"
          class="text-black-100 placeholder-black-200 block h-full w-full rounded-md border border-transparent bg-gray-400 bg-opacity-25 py-2 pl-10 pr-3 leading-5 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm"
          v-model="query"
          @keyup="doSearch"
          ref="searchBar"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { MagnifyingGlassIcon } from '@heroicons/vue/20/solid'
import { useRoute, useRouter } from 'vue-router'
import { usePageStore } from '../stores/page'
import { ref, watch } from 'vue'
import _ from 'lodash'

const router = useRouter()
const route = useRoute()
const store = usePageStore()

let query = ref('')

const doSearch = _.debounce(function () {
  let q = query.value.trim()
  store.updateSearch(q, router)
}, 300)

watch(
  () => route.path,
  (newPath) => {
    if (newPath !== '/search') {
      query.value = ''
    }
  }
)

const searchBar = ref(null)

const focusSearch = () => searchBar.value.focus()

defineExpose({ focusSearch })
</script>
