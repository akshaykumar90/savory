<template>
  <div>
    <div class="h-16"></div>
    <div
      class="fixed top-0 z-10 h-16 w-full transition-shadow"
      :class="{ 'shadow-lg': scrollTop > 0 }"
    >
      <AppHeader ref="appHeader"></AppHeader>
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
        class="fixed left-0 top-0 right-0 z-20"
      ></TopToolbar>
    </transition>
  </div>
  <div class="mx-2 flex gap-4">
    <div class="hidden sm:block sm:flex-shrink-0">
      <div class="top-16 w-64">
        <NavSidebar></NavSidebar>
      </div>
    </div>
    <div class="min-w-0 max-w-[36rem] flex-1">
      <main class="border">
        <router-view></router-view>
      </main>
    </div>
  </div>
  <footer class="hidden h-16 sm:block"></footer>
  <delete-confirmation ref="deleteConfirmation"></delete-confirmation>
</template>

<script setup>
import NavSidebar from '../components/NavSidebar.vue'
import AppHeader from '../components/AppHeader.vue'
import TopToolbar from '../components/TopToolbar.vue'
import { useScroll } from '@vueuse/core'
import { computed, onMounted, onUnmounted, provide, ref } from 'vue'
import { useSelectionStore } from '../stores/selection'
import DeleteConfirmation from '../components/DeleteConfirmation.vue'

const { y: scrollTop } = useScroll(window)

const store = useSelectionStore()

const showToolbar = computed(() => store.selectedIds.size > 0)

const deleteConfirmation = ref(null)

provide('deleteConfirmation', deleteConfirmation)

const appHeader = ref(null)

const onKeydown = function (e) {
  if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
    appHeader.value.focusSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>
