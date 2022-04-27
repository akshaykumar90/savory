<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="(value, key) in data" :key="key" class="flex py-4">
      <router-link
        :to="{ path: '/tag', query: { name: key } }"
        class="mx-4 flex w-full flex-row justify-between"
      >
        <span class="text-gray-900 line-clamp-1">{{ key }}</span>
        <span class="text-gray-900">{{ value }}</span>
      </router-link>
    </li>
  </ul>
</template>

<script setup>
import { useTags } from '../composables/useTags'

const { data } = useTags()
</script>
