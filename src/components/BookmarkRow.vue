<template>
  <div class="text-sm px-1">
    <a :href="bookmark.url" target="_blank" rel="noopener" class="text-default leading-normal no-underline hover:underline">{{ bookmark.title }}</a>
    <p class="mt-2 text-xs">{{ date }}</p>
    <TagsRow :bookmark-id="bookmarkId"></TagsRow>
  </div>
</template>

<script>
  import TagsRow from './TagsRow.vue'
  import moment from 'moment';

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
      },
      date () {
        const dateAdded = moment(this.bookmark.dateAdded)
        // ll	-> Sep 4, 1986
        return dateAdded.format('ll')
      }
    }
  }
</script>
