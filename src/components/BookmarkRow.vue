<template>
  <div class="flex items-start">
    <label class="pr-4 pt-1">
      <input type="checkbox" class="form-checkbox text-primary h-4 w-4" v-model="selected">
    </label>
    <div class="text-sm px-1 flex-grow">
      <a :href="bookmark.url" target="_blank" rel="noopener" class="text-default leading-normal">{{ bookmark.title }}</a>
      <p class="mt-2 text-xs">{{ date }}</p>
      <TagsRow :bookmark-id="bookmarkId"></TagsRow>
    </div>
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
      },
      selected: {
        get () {
          return this.$store.state.lists['selected'].includes(this.bookmarkId)
        },
        set (value) {
          let payload = { id: this.bookmarkId }
          if (value) {
            this.$store.commit('ADD_TO_SELECTED', payload)
          } else {
            this.$store.commit('REMOVE_FROM_SELECTED', payload)
          }
        }
      }
    }
  }
</script>
