<template>
  <div class="bg-white h-16 flex items-center justify-between sm:justify-start">
    <div class="px-4 sm:px-6 lg:px-8">1 selected</div>
    <div class="px-4 sm:px-6 lg:px-8">
      <div class="py-3 flex justify-between">
        <div>
          <span class="relative z-0 inline-flex rounded-md space-x-3">
            <span class="hidden sm:inline-flex sm:shadow-sm">
              <tags-popover>
                <PopoverButton
                  type="button"
                  class="inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                >
                  <ReplyIcon
                    class="mr-2.5 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                  <span>Tags</span>
                </PopoverButton>
              </tags-popover>
            </span>

            <span class="inline-flex sm:hidden">
              <button
                type="button"
                class="inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
                @click="openDialog"
              >
                <ReplyIcon
                  class="mr-2.5 h-5 w-5 text-gray-400"
                  aria-hidden="true"
                />
                <span>Tags</span>
                <tags-dialog ref="dialog"></tags-dialog>
              </button>
            </span>

            <span class="inline-flex sm:shadow-sm">
              <button
                type="button"
                class="inline-flex -ml-px relative items-center px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-600 focus:border-blue-600"
              >
                <ArchiveIconSolid
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
import { ArchiveIcon as ArchiveIconSolid } from '@heroicons/vue/solid'
import { ReplyIcon } from '@heroicons/vue/solid'
import { PopoverButton } from '@headlessui/vue'

import TagsPopover from './TagsPopover.vue'

import TagsDialog from './TagsDialog.vue'
import { ref } from 'vue'

const dialog = ref(null)

function openDialog() {
  dialog.value.openModal()
}
</script>
