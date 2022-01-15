<template>
  <div>
    <div class="h-16"></div>
    <div
      class="w-full fixed top-0 h-16 z-10 transition-shadow"
      :class="{ 'shadow-lg': scrollTop > 0 }"
    >
      <AppHeader></AppHeader>
    </div>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 -translate-y-6"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 -translate-y-6"
    >
      <TopToolbar
        v-if="showToolbar"
        class="fixed z-20 left-0 top-0 right-0"
      ></TopToolbar>
    </transition>
  </div>
  <div class="flex flex-row gap-4 sm:mx-2">
    <div class="hidden sm:block flex-none w-[275px]">
      <div class="fixed top-16 w-[275px]">
        <NavSidebar></NavSidebar>
      </div>
    </div>
    <main class="border-l border-r border-b w-full max-w-[600px]">
      <bookmarks-list v-if="true"></bookmarks-list>
      <tags-list v-else></tags-list>
    </main>
  </div>
  <footer class="hidden sm:block h-16"></footer>
</template>

<script setup>
import NavSidebar from '../components/NavSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import TopToolbar from '../components/TopToolbar.vue'
import BookmarksList from '../components/BookmarksList.vue'
import TagsList from '../components/TagsList.vue'
import { useScroll } from '@vueuse/core'
import { computed } from 'vue'
import { useSelectionStore } from '../stores/selection'

const { y: scrollTop } = useScroll(window)

const store = useSelectionStore()

const showToolbar = computed(() => store.selectedIds.size > 0)
</script>
