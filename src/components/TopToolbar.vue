<template>
  <div
    class="mx-4 flex h-16 items-center justify-between bg-white sm:justify-start"
  >
    <div class="flex items-center">
      <button
        type="button"
        class="inline-flex items-center rounded-full border border-transparent bg-transparent text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:p-2"
        @click="clearSelected"
      >
        <XMarkIcon class="h-5 w-5" aria-hidden="true" />
      </button>
      <div class="mx-4 tabular-nums">{{ numSelected }} selected</div>
    </div>
    <div class="sm:px-6 lg:px-8">
      <div class="flex justify-between py-3">
        <div>
          <span class="relative z-0 inline-flex space-x-3 rounded-md">
            <span class="hidden sm:inline-flex sm:shadow-sm">
              <tags-popover bulk>
                <PopoverButton
                  type="button"
                  class="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                >
                  <TagIcon
                    class="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Edit</span>
                </PopoverButton>
              </tags-popover>
            </span>

            <span class="inline-flex sm:hidden">
              <button
                type="button"
                class="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                @click="openTagsDialog"
              >
                <TagIcon
                  class="mr-2.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Edit</span>
                <tags-dialog ref="tagsDialog" bulk></tags-dialog>
              </button>
            </span>

            <span class="inline-flex sm:shadow-sm">
              <button
                type="button"
                class="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                @click="onDelete"
              >
                <TrashIcon
                  class="mr-2.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Delete</span>
              </button>
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrashIcon } from '@heroicons/vue/20/solid'
import { TagIcon } from '@heroicons/vue/20/solid'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { PopoverButton } from '@headlessui/vue'

import TagsPopover from './TagsPopover.vue'
import TagsDialog from './TagsDialog.vue'
import { useSelectionStore } from '../stores/selection'

import { computed, inject, ref } from 'vue'

const tagsDialog = ref(null)

const store = useSelectionStore()

const numSelected = computed(() => store.selectedIds.size)
const clearSelected = () => store.clear()

function openTagsDialog() {
  tagsDialog.value.openModal()
}

let deleteConfirmation = inject('deleteConfirmation')

function onDelete() {
  deleteConfirmation.value.openModal(Array.from(store.selectedIds))
}
</script>
