<template>
  <div>
    <ol class="list-reset text-sm">
      <BookmarkRow
        v-for="item in current"
        v-bind:bookmark-id="item"
        v-bind:key="item">
      </BookmarkRow>
    </ol>
    <div>
      <BookmarkLoader v-if="bottom"></BookmarkLoader>
    </div>
  </div>
</template>

<script>
  import BookmarkRow from './BookmarkRow.vue'
  import BookmarkLoader from './BookmarkLoader.vue'
  import _ from 'lodash'

  export default {
    name: 'BookmarkList',

    components: {
      BookmarkRow,
      BookmarkLoader
    },

    data: function () {
      return {
        bottom: false
      }
    },

    computed: {
      current () {
        return this.$store.getters.activeIds
      },
      hasMore () {
        return this.$store.state.page < this.$store.getters.maxPage
      },
    },

    methods: {
      bottomVisible() {
        const scrollY = window.scrollY
        const visible = document.documentElement.clientHeight
        const pageHeight = document.documentElement.scrollHeight
        const bottomOfPage = visible + scrollY >= pageHeight
        return bottomOfPage || pageHeight < visible
      },
      loadMoreBookmarks: _.debounce(function () {
        this.$store.dispatch('LOAD_MORE_BOOKMARKS').then(() => {
          this.bottom = false
        })
      }, 1000)
    },

    created () {
      window.addEventListener('scroll', () => {
        if (this.bottomVisible() && this.hasMore) {
          this.bottom = true
          this.loadMoreBookmarks()
        }
      })
    },

  }
</script>