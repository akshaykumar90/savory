<template>
  <div class="w-[300px] p-2">
    <div
      v-if="isLoading || isIdle"
      class="flex min-h-[187px] items-center justify-center"
    >
      <Spinner></Spinner>
    </div>
    <div
      v-else-if="isError"
      class="rounded-md p-4"
      :class="{ 'bg-red-50': !unauthorizedError }"
    >
      <div v-if="unauthorizedError">
        <div>
          <h3 class="text-lg font-medium leading-6 text-gray-900">
            Login to Savory
          </h3>
          <div class="mt-2 max-w-xl text-sm text-gray-500">
            <p>
              To add this tab to Savory, you need to log in or create a new
              account.
            </p>
          </div>
          <div class="mt-5">
            <button
              @click="openSavory"
              type="button"
              class="inline-flex items-center rounded-md border border-transparent bg-sky-600 px-4 py-2 font-medium text-white shadow-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 sm:text-sm"
            >
              Login
            </button>
          </div>
        </div>
      </div>
      <div v-else class="flex">
        <div class="flex-shrink-0">
          <XCircleIcon class="h-5 w-5 text-red-400" aria-hidden="true" />
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">
            There was an error adding to Savory
          </h3>
          <div class="mt-2 text-sm text-red-700">
            <p>{{ error }}</p>
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
            <template v-if="isOldBookmark">
              <h3 class="text-sm font-medium text-green-800">Already saved!</h3>
              <div class="mt-2 text-sm text-green-700">
                <p>Last added on {{ bookmarkCreatedTime }}</p>
              </div>
            </template>
            <template v-else>
              <h3 class="text-sm font-medium text-green-800">
                Added to Savory
              </h3>
              <div class="mt-2 text-sm text-green-700">
                <p>{{ data.title }}</p>
              </div>
            </template>
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
          class="overflow-hidden rounded-md bg-white ring-1 ring-black ring-opacity-5"
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
import Spinner from './components/Spinner.vue'

const savory_app_url = process.env.SAVORY_APP_URL

const queryClient = useQueryClient()

const unauthorizedError = computed(
  () =>
    error.value && error.value.response && error.value.response.status === 401
)

const { isLoading, isIdle, isError, data, error, mutate } = useMutation(
  async (tab) => {
    const resp = await ApiClient.saveTab(tab)
    return resp.data
  },
  {
    onSuccess: (bookmark) => {
      queryClient.setQueryData(['bookmarks', bookmark.id], bookmark)
    },
    // Upto 3 retry attempts (i.e. 4 attempts total) in case of timeouts
    retry: (failureCount, error) => {
      if (
        error.request &&
        (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED')
      ) {
        return failureCount < 3
      }
      return false
    },
    // Exponential backoff delay, starting with 500ms
    retryDelay: (failureCount) =>
      ~~((Math.random() + 0.5) * (1 << Math.min(failureCount, 8))) * 500,
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

// Old bookmark means that the bookmark was already saved when the user clicked
// the extension to save.
//
// The extension only gets to know this after it attempts to save the bookmark
// into Savory. Even then, the backend response does not distinguish between a
// brand-new bookmark or if the bookmark was already present. In both cases, it
// returns a bookmark object which is present in the database.
//
// So, we determine that here by comparing the bookmark created time returned in
// response with the current time and use 10 seconds as an arbitrary cutoff
// value.
const isOldBookmark = computed(() => {
  if (data.value) {
    const now = new Date()
    const bookmarkCreated = new Date(data.value.date_added)
    const tenSecondMillis = 10 * 1000
    return bookmarkCreated < now - tenSecondMillis
  }
})

const bookmarkCreatedTime = computed(() => {
  if (data.value) {
    const bookmarkDate = new Date(data.value.date_added)
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return bookmarkDate.toLocaleDateString(undefined, options)
  }
})

onMounted(() => {
  saveCurrentTab()
})
</script>

<style src="./assets/app.css"></style>
