<template>
  <ul role="list">
    <li v-for="(value, key) in data" :key="key">
      <router-link
        :to="{ path: '/tag', query: { name: key } }"
        class="flex w-full flex-row justify-between rounded-lg p-4 text-gray-900 hover:bg-gray-50 hover:text-primary"
      >
        <span class="line-clamp-1">{{ key }}</span>
        <span>{{ value }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { useTags } from '../composables/useTags'

const { data } = useTags()

document.title = 'Tags – Savory'
</script>
