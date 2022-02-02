<template>
  <pagination-card class="border-b"></pagination-card>
  <ul role="list" v-if="data" class="flex flex-col divide-y divide-gray-200">
    <bookmark-row
      v-for="item in data['bookmarks']"
      :key="item['id']"
      :bookmarkId="item['id']"
      :title="item['title']"
      :tags="item['tags']"
      :site="item['site']"
    />
  </ul>
</template>

<script setup>
import BookmarkRow from '../components/BookmarkRow.vue'
import PaginationCard from '../components/PaginationCard.vue'

import useBookmarksPage from '../composables/useBookmarksPage'
import { watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { usePageStore } from '../stores/page'
import { useQueryClient } from 'vue-query'

const { data } = useBookmarksPage()

const route = useRoute()

const store = usePageStore()
const queryClient = useQueryClient()

watch(
  () => route.query,
  (routeQuery) => store.onRouteUpdate(routeQuery)
)

onBeforeRouteUpdate((to) => store.onBeforeRouteUpdate(to, queryClient))
</script>
