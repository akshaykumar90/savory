<template>
  <div class="w-[300px] p-2">
    <div
      v-if="isLoading || isIdle"
      class="flex min-h-[187px] items-center justify-center"
    >
      <svg
        class="h-5 w-5 animate-spin text-primary"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          class="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          stroke-width="4"
        ></circle>
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
    </div>
    <div v-else-if="isError" class="rounded-md bg-red-50 p-4">
      <div class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            There was an error saving to Savory
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>All our servers are busy. Please give us a moment.</p>
          </div>
        </div>
      </div>
    </div>
    <Popover v-else class="relative">
      <div class="rounded-md bg-green-50 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <CheckCircleIcon
              class="h-5 w-5 text-green-400"
              aria-hidden="true"
            />
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-green-800">Added to Savory</h3>
            <div class="mt-2 text-sm text-green-700">
              <p>Saved bookmark id is: {{ bookmarkId }}</p>
            </div>
            <div class="mt-4">
              <div class="-mx-2 -my-1.5 flex">
                <popover-button
                  type="button"
                  class="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  <span>Add tags</span>
                </popover-button>
                <button
                  @click="openSavory"
                  type="button"
                  class="ml-3 rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                >
                  Open Savory
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PopoverPanel class="mt-2">
        <div
          class="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <edit-tags :bookmark-id="bookmarkId" :popup="true"></edit-tags>
        </div>
      </PopoverPanel>
    </Popover>
  </div>
</template>

<script setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { computed, onMounted } from 'vue'
import { CheckCircleIcon } from '@heroicons/vue/20/solid'
import { XCircleIcon } from '@heroicons/vue/20/solid'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import EditTags from './components/EditTags.vue'

const savory_app_url = 'https://app.savory.test:8080'

const queryClient = useQueryClient()

const { isLoading, isIdle, isError, data, error, mutate } = useMutation(
  async (tab) => {
    const resp = await ApiClient.saveTab(tab)
    return resp.data
  },
  {
    onSuccess: (bookmark) => {
      queryClient.setQueryData(['bookmarks', bookmark.id], bookmark)
    },
  }
)

const bookmarkId = computed(() => data.value && data.value.id)

async function saveCurrentTab() {
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
}

function openSavory() {
  chrome.tabs.create({ url: savory_app_url })
}

onMounted(() => {
  saveCurrentTab()
})
</script>

<style src="./assets/app.css"></style>
