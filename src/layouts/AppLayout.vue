<template>
  <div>
    <div
      class="w-full fixed top-0 h-16 z-10 transition-shadow"
      :class="{ 'shadow-lg': scrollTop > 0 }"
    >
      <AppHeader></AppHeader>
    </div>
    <div class="h-16"></div>
  </div>
  <div class="flex flex-row gap-8 ml-2">
    <div class="w-[275px]">
      <div class="fixed top-16 w-[275px]">
        <NavSidebar></NavSidebar>
      </div>
    </div>
    <main class="max-w-[600px]">
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-6"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-6"
      >
        <TopToolbar
          v-if="show"
          class="fixed z-20 left-0 top-0 right-0"
        ></TopToolbar>
      </transition>
      <pagination-card></pagination-card>
      <div class="space-y-4" @click="show = !show">
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
import AppHeader from '../components/AppHeader.vue'
import TopToolbar from '../components/TopToolbar.vue'
import PaginationCard from '../components/PaginationCard.vue'
import { useScroll } from '@vueuse/core'

import { ref } from 'vue'

const show = ref(false)

const { y: scrollTop } = useScroll(window)
</script>
