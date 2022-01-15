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

import useBookmarks from '../composables/useBookmarks'

const { data } = useBookmarks()
</script>
