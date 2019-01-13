<template>
  <div class="text-sm">
    <a :href="bookmark.url" target="_blank" rel="noopener" class="no-underline hover:underline">{{ bookmark.title }}</a>
    <TagsRow :bookmark-id="bookmarkId"></TagsRow>
  </div>
</template>

<script>
  import TagsRow from './TagsRow.vue'

  export default {
    name: 'bookmark-row',

    components: {
      TagsRow
    },

    props: {
      bookmarkId: String
    },

    computed: {
      bookmark () {
        return this.$store.getters.getBookmarkById(this.bookmarkId)
      }
    }
  }
</script>
