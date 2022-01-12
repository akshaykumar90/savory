<template>
  <pagination-card class="border-b"></pagination-card>
  <ul role="list" v-if="data" class="flex flex-col divide-y divide-gray-200">
    <bookmark-row
      v-for="item in data['bookmarks']"
      :key="item['id']"
      :title="item['title']"
      :tags="item['tags']"
    />
  </ul>
</template>

<script setup>
import BookmarkRow from '../components/BookmarkRow.vue'
import PaginationCard from '../components/PaginationCard.vue'

import { useRoute } from 'vue-router'
import useBookmarks from '../composables/useBookmarks'

const route = useRoute()

const { data } = useBookmarks(route.name, route.query)
</script>
