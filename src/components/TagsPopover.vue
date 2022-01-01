<template>
  <Popover class="relative">
    <slot></slot>
    <transition
      enter-active-class="transition ease-out duration-200"
      enter-from-class="opacity-0 translate-y-1"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition ease-in duration-150"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-1"
    >
      <PopoverPanel
        class="absolute z-50 left-0 mt-3 px-2 w-screen max-w-xs sm:px-0"
      >
        <div
          class="bg-white ring-1 ring-black ring-opacity-5 overflow-hidden shadow-lg rounded-lg"
        >
          <edit-tags></edit-tags>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script setup>
import { Popover, PopoverPanel } from '@headlessui/vue'
import EditTags from './EditTags.vue'
</script>
