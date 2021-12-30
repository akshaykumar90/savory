<template>
  <div>
    <header
      class="w-full fixed top-0 h-16 z-10 bg-red-200 transition-shadow duration-300"
      :class="{ 'shadow-lg': scrollTop > 0 }"
    ></header>
    <div class="h-16"></div>
  </div>
  <div class="flex flex-row gap-8 ml-2">
    <div class="w-[275px]">
      <div class="fixed top-16 w-[275px]">
        <NavSidebar></NavSidebar>
      </div>
    </div>
    <main class="max-w-[600px]">
      <pagination-card></pagination-card>
      <div class="space-y-4">
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
      </div>
    </main>
  </div>
</template>

<script setup>
import BookmarkRow from '../components/BookmarkRow.vue'
import NavSidebar from '../components/NavSidebar.vue'
import PaginationCard from '../components/PaginationCard.vue'
import { useScroll } from '@vueuse/core'

const { y: scrollTop } = useScroll(window)
</script>
