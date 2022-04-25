<template>
  <li class="flex items-start gap-2 py-4" @click="">
    <button>
      <MenuAlt2Icon
        v-if="!selected"
        class="mx-4 mt-0.5 h-5 w-5 flex-none text-gray-400"
        aria-hidden="true"
        @click="check"
      />
      <CheckIcon
        v-else
        class="mx-3.5 mt-0.5 h-6 w-6 flex-none text-gray-600"
        aria-hidden="true"
        @click="uncheck"
      />
    </button>
    <div class="pr-2">
      <p class="text-base font-bold line-clamp-2">
        <a :href="bookmark.url" target="_blank" rel="noopener">{{
          bookmark.title
        }}</a>
      </p>
      <div class="mt-2 flex flex-row flex-wrap gap-2 text-sm text-zinc-500">
        <router-link
          class="decoration-primary underline-offset-1 hover:text-primary hover:underline"
          v-if="bookmark.site"
          :to="{ path: '/tag', query: { site: bookmark.site } }"
        >
          {{ bookmark.site }}
        </router-link>
        <router-link
          class="decoration-primary underline-offset-1 hover:text-primary hover:underline"
          v-for="(tag, index) in bookmark.tags"
          :key="index"
          :to="{ path: '/tag', query: { name: tag } }"
        >
          {{ tag }}
        </router-link>
      </div>
      <div class="mt-2 flex flex-row gap-1.5 text-sm text-zinc-500">
        <span class="inline-block">{{ timeString }}</span>
        {{ '·' }}
        <span class="hidden sm:inline-flex">
          <tags-popover :bookmark-id="bookmarkId">
            <popover-button type="button">
              <span>edit</span>
            </popover-button>
          </tags-popover>
        </span>
        <span class="inline-flex sm:hidden">
          <button type="button" @click="openTagsDialog">
            <span>edit</span>
          </button>
          <tags-dialog ref="tagsDialog" :bookmark-id="bookmarkId"></tags-dialog>
        </span>
        {{ '·' }}
        <button type="button" @click="onDelete">
          <span>delete</span>
        </button>
      </div>
    </div>
  </li>
</template>

<script>
import TagsPopover from './TagsPopover.vue'
import { PopoverButton } from '@headlessui/vue'
import { MenuAlt2Icon } from '@heroicons/vue/solid'
import { CheckCircleIcon as CheckIcon } from '@heroicons/vue/solid'
import { computed, inject } from 'vue'
import { useSelectionStore } from '../stores/selection'
import TagsDialog from './TagsDialog.vue'
import { useBookmark } from '../composables/useBookmark'
import { ref } from 'vue'

export default {
  components: {
    MenuAlt2Icon,
    CheckIcon,
    PopoverButton,
    TagsPopover,
    TagsDialog,
  },
  props: ['bookmarkId', 'site', 'tags', 'title'],
  setup(props) {
    const store = useSelectionStore()
    const { data } = useBookmark(props.bookmarkId)
    const selected = computed(() => store.selectedIds.has(props.bookmarkId))
    const tagsDialog = ref(null)
    let deleteConfirmation = inject('deleteConfirmation')
    const onDelete = () => {
      deleteConfirmation.value.openModal([props.bookmarkId])
    }
    const openTagsDialog = () => {
      tagsDialog.value.openModal()
    }
    const timeString = computed(() => {
      const bookmarkDate = new Date(data.value.date_added)
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return bookmarkDate.toLocaleDateString(undefined, options)
    })
    return {
      bookmark: data,
      timeString,
      onDelete,
      tagsDialog,
      openTagsDialog,
      check: () => store.add(props.bookmarkId),
      uncheck: () => store.remove(props.bookmarkId),
      selected,
    }
  },
}
</script>
