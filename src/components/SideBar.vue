<template>
  <div class="space-y-4">
    <section>
      <p class="text-xs text-muted">{{ pluralized }}</p>
      <p class="text-2xl text-muted font-bold mt-2">
        {{ numBookmarks.toLocaleString('en') }}
      </p>
    </section>
    <section v-if="numSelected" class="space-y-2">
      <div>
        <!-- This extra margin is required to offset TagsRow component's
             default negative left margin :shrug: -->
        <div class="ml-1">
          <TagsRow :bookmark-id="bulkEditBookmarkId"></TagsRow>
        </div>
      </div>
      <button
        class="p-2 border border-default rounded flex items-center bg-default select-none focus:outline-none"
        @click="clearSelected"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 stroke-current text-muted"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span class="ml-2 text-sm font-medium tracking-wide text-muted"
          >Unselect</span
        >
      </button>
      <button
        class="p-2 border border-transparent rounded flex items-center bg-red-600 select-none focus:outline-none"
        @click="deleteSelected"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-4 w-4 stroke-current text-red-100"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
        <span class="ml-2 text-sm font-medium tracking-wide text-red-100"
          >Delete</span
        >
      </button>
    </section>
  </div>
</template>

<script>
import TagsRow from './TagsRow.vue'
import { SENTINEL_BULK_EDIT_BOOKMARK_ID } from './TagsRow.vue'

export default {
  name: 'side-bar',

  components: {
    TagsRow,
  },

  data: function () {
    return {
      bulkEditBookmarkId: SENTINEL_BULK_EDIT_BOOKMARK_ID,
    }
  },

  computed: {
    numBookmarks() {
      return this.$store.getters.numBookmarks
    },
    pluralized() {
      return this.numBookmarks === 1 ? 'Bookmark' : 'Bookmarks'
    },
    numSelected() {
      return this.$store.getters.numSelected
    },
  },

  methods: {
    deleteSelected() {
      this.$store.dispatch('DELETE_SELECTED')
    },
    clearSelected() {
      this.$store.dispatch('CLEAR_SELECTED')
    },
  },
}
</script>
