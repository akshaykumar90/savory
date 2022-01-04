<template>
  <pagination-card class="border-b"></pagination-card>
  <ul role="list" class="flex flex-col divide-y divide-gray-200">
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
    <bookmark-row />
  </ul>
</template>

<script setup>
import BookmarkRow from '../components/BookmarkRow.vue'
import PaginationCard from '../components/PaginationCard.vue'
</script>
