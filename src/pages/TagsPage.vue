<template>
  <div class="border-b border-gray-200 bg-white p-4">
    <div class="-ml-4 -mt-2 flex flex-nowrap items-center justify-between">
      <div class="ml-4 mt-2 flex-shrink-0">
        <input
          type="text"
          v-model="inputFilter"
          autocomplete="off"
          name="add-tag"
          id="add-tag"
          class="block w-full rounded-md border-gray-300 bg-transparent text-default shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ref="addTagInput"
          placeholder="Filter tags&hellip;"
        />
      </div>
      <div class="ml-4 mt-2" v-if="data">
        <h3 class="text-lg font-medium leading-6 text-gray-900">
          {{ Object.keys(filteredTags).length }}
        </h3>
      </div>
    </div>
  </div>
  <ul role="list">
    <li v-for="(value, key) in filteredTags" :key="key">
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
import { computed, ref } from 'vue'

const { data } = useTags()

const inputFilter = ref('')

const filteredTags = computed(() => {
  if (!data.value) {
    return {}
  }
  if (!inputFilter.value) {
    return data.value
  }
  let src = data.value
  let filterStr = inputFilter.value.toLowerCase()
  return Object.keys(src)
    .filter((key) => key.toLowerCase().includes(filterStr))
    .reduce((obj, key) => {
      obj[key] = src[key]
      return obj
    }, {})
})

document.title = 'Tags – Savory'
</script>
