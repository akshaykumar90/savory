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
        class="absolute left-0 z-50 mt-3 w-screen max-w-xs px-2 sm:px-0"
      >
        <div
          class="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5"
        >
          <edit-tags
            :bookmark-id="bookmarkId"
            :bulk="bulk"
            :popup="popup"
          ></edit-tags>
        </div>
      </PopoverPanel>
    </transition>
  </Popover>
</template>

<script>
import { Popover, PopoverPanel } from '@headlessui/vue'
import EditTags from './EditTags.vue'

export default {
  components: {
    PopoverPanel,
    Popover,
    EditTags,
  },
  props: {
    bookmarkId: String,
    bulk: Boolean,
    popup: Boolean,
  },
}
</script>
