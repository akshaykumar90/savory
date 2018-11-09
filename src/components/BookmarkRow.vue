<template>
  <li class="mb-2">
    <a :href="bookmark.site" target="_blank" rel="noopener" class="no-underline hover:underline">{{ bookmark.title }}</a>
    <TagsRow :bookmark-id="bookmarkId"></TagsRow>
  </li>
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
