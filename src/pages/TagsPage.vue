<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="tagObject in data" :key="tagObject.name" class="flex py-4">
      <div class="mx-4 flex w-full flex-row justify-between">
        <span class="text-gray-900 line-clamp-1">{{ tagObject.name }}</span>
        <span class="text-gray-900">{{ tagObject.count }}</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
import { useTags } from '../composables/useTags'

const { data } = useTags()
</script>
