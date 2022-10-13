<template>
  <div class="w-64">
    <span v-if="isLoading">Saving to queue...</span>
    <span v-else-if="isError">Error: {{ error.message }}</span>
    <div v-else>
      {{ data }}
    </div>
  </div>
</template>

<script setup>
import { useMutation } from '@tanstack/vue-query'
import { onMounted } from 'vue'

const { isLoading, isError, data, error, mutate } = useMutation((tab) =>
  ApiClient.saveTab(tab)
)

onMounted(async () => {
  let queryOptions = { active: true, lastFocusedWindow: true }
  // `tab` will either be a `tabs.Tab` instance or `undefined`.
  let [tab] = await chrome.tabs.query(queryOptions)
  if (tab) {
    mutate({
      dateAddedMs: Date.now(),
      title: tab.title,
      url: tab.url,
    })
  }
})
</script>

<style src="./assets/app.css"></style>
