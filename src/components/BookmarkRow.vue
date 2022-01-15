<template>
  <li class="flex items-start py-4 gap-2" @click="">
    <button>
      <MenuAlt2Icon
        v-if="!selected"
        class="flex-none h-5 w-5 mt-0.5 mx-4 text-gray-400"
        aria-hidden="true"
      />
      <CheckIcon
        v-else
        class="flex-none h-6 w-6 mt-0.5 mx-3.5 text-gray-600"
        aria-hidden="true"
      />
    </button>
    <div class="pr-2">
      <h3 class="line-clamp-2">{{ title }}</h3>
      <div class="mt-2 flex flex-row flex-wrap gap-1.5">
        <a href="#" v-if="site">{{ site }}</a>
        <a v-for="(tag, index) in tags" :key="index">
          {{ tag }}
        </a>
        <tags-popover :bookmark-id="bookmarkId">
          <popover-button type="button">
            <span>add tag</span>
          </popover-button>
        </tags-popover>
      </div>
      <span class="inline-block mt-2">4 days ago</span>
    </div>
  </li>
</template>

<script>
import TagsPopover from './TagsPopover.vue'
import { PopoverButton } from '@headlessui/vue'
import { MenuAlt2Icon } from '@heroicons/vue/solid'
import { CheckCircleIcon as CheckIcon } from '@heroicons/vue/solid'
import { ref } from 'vue'

export default {
  components: {
    MenuAlt2Icon,
    CheckIcon,
    PopoverButton,
    TagsPopover,
  },
  props: ['bookmarkId', 'site', 'tags', 'title'],
  setup() {
    const selected = ref(false)
    return {
      selected,
    }
  },
}
</script>
