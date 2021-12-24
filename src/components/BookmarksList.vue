<template>
  <div class="bg-white">
    <div
      class="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <div>
        <bookmark-row />
      </div>
    </div>
  </div>
</template>

<script>
import BookmarkRow from './BookmarkRow.vue'

export default {
  name: 'bookmarks-list',
  components: {
    BookmarkRow,
  },
}
</script>
