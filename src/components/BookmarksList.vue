<template>
  <pagination-card class="border-b"></pagination-card>
  <ul role="list" class="flex flex-col divide-y divide-gray-200">
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

const data = {
  bookmarks: [
    {
      date_added: 1641302018753,
      id: 'AxYKVywr',
      site: 'ishadeed.com',
      tags: ['css'],
      title: 'Handling Short And Long Content In CSS - Ahmad Shadeed',
      url: 'https://ishadeed.com/article/css-short-long-content/',
    },
  ],
}
</script>
