<template>
  <div>
    <nav class="mx-3 flex items-center gap-4 overflow-x-auto bg-white py-4">
      <p class="flex-none">Add to filter</p>
      <tag-button
        class="flex-none"
        v-for="(value, key) in data.drillTags"
        :key="key"
        :name="key"
        :onClick="onClick"
      ></tag-button>
    </nav>
  </div>
</template>

<script setup>
import TagButton from './TagButton.vue'
import { useRouter } from 'vue-router'
import { usePageStore } from '../stores/page'
import useBookmarksPage from '../composables/useBookmarksPage'

const { data } = useBookmarksPage()

const router = useRouter()
const store = usePageStore()

function onClick(tagName) {
  store.updateTags(tagName, router)
}
</script>
