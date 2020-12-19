<template>
  <div class="flex items-start">
    <label class="pr-4 pt-1 hidden md:block">
      <input
        type="checkbox"
        class="rounded border-gray-300 text-blue-500 shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        v-model="bookmark.selected"
      />
    </label>
    <div class="px-1 flex-grow space-y-2">
      <a
        :href="bookmark.url"
        target="_blank"
        rel="noopener"
        class="text-sm text-default leading-5"
        >{{ bookmark.title }}
      </a>
      <p class="text-xs text-grey-500 leading-3">{{ date }}</p>
      <div>
        <TagsRow :bookmark-id="bookmarkId"></TagsRow>
      </div>
    </div>
  </div>
</template>

<script>
import TagsRow from './TagsRow.vue'
import moment from 'moment'

export default {
  name: 'bookmark-row',

  components: {
    TagsRow,
  },

  props: {
    bookmarkId: String,
  },

  computed: {
    bookmark() {
      return this.$store.getters.getBookmarkById(this.bookmarkId)
    },
    date() {
      const dateAdded = moment(this.bookmark.dateAdded)
      // ll	-> Sep 4, 1986
      return dateAdded.format('ll')
    },
  },
}
</script>
