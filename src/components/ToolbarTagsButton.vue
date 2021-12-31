<template>
  <Popover class="relative" v-slot="{ open }">
    <PopoverButton
      type="button"
      class="hidden sm:inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
    >
      <ReplyIcon class="mr-2.5 h-5 w-5 text-gray-400" aria-hidden="true" />
      <span>Tags</span>
    </PopoverButton>

    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute z-50 left-0 mt-3 px-2 w-screen max-w-xs sm:px-0 bg-white"
      >
        <div
          class="ring-1 ring-black ring-opacity-5 overflow-hidden shadow-lg rounded-lg divide-y divide-gray-200"
        >
          <div class="px-4 py-5 sm:p-6">
            <div class="flex">
              <label for="add-tag" class="sr-only">Add tag</label>
              <input
                type="text"
                name="add-tag"
                id="add-tag"
                class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                placeholder="Add a tag"
              />
            </div>
          </div>
          <div class="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
            <tag-button v-for="tag in tags">
              {{ tag }}
            </tag-button>
          </div>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'
import { ReplyIcon } from '@heroicons/vue/solid'
import TagButton from './TagButton.vue'
const tags = [
  'web.dev',
  'frontend',
  'books',
  'performance',
  'nextjs',
  'performance',
  'web.dev',
  'frontend',
  'angularjs',
]
</script>
