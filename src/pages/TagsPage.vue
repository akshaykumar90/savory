<template>
  <LoadError v-if="isError" :detail="errorDetail">
    <PrimaryButton button-text="Retry" @click="onRetry">
      <ArrowPathIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    </PrimaryButton>
  </LoadError>
  <div v-if="data">
    <div class="border-b border-gray-200 bg-white p-4">
      <div class="-ml-4 -mt-2 flex flex-nowrap items-center justify-between">
        <div class="ml-4 mt-2 flex-shrink-0">
          <input
            type="text"
            v-model="inputFilter"
            autocomplete="off"
            name="filter-tags"
            id="filter-tags"
            class="block w-full rounded-md border-gray-300 bg-transparent text-default shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            placeholder="Filter tags&hellip;"
          />
        </div>
        <div class="ml-4 mt-2">
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
  </div>
</template>

<script setup>
import { useTags } from '../composables/useTags'
import { computed, ref } from 'vue'
import LoadError from '../components/LoadError.vue'
import PrimaryButton from '../components/PrimaryButton.vue'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

const { isError, error, data, refetch: onRetry } = useTags()

const errorDetail = computed(() => {
  if (error.value) {
    return `${error.value.toString()}. Please try again.`
  }
})

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
