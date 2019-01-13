<template>
  <div>
    <ol class="list-reset">
      <li
        class="mb-2"
        v-for="item in current"
        v-bind:key="item">
        <BookmarkRow v-bind:bookmark-id="item"/>
      </li>
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
        // Some wiggle room (.9) to allow time to load content before user
        // reaches bottom
        const bottomOfPage = visible + scrollY >= .9 * pageHeight
        return bottomOfPage || pageHeight < visible
      },
      onScroll() {
        if (this.bottomVisible() && this.hasMore) {
          this.bottom = true
          this.$store.dispatch('LOAD_MORE_BOOKMARKS').then(() => {
            this.bottom = false
          })
        }
      }
    },

    created () {
      window.addEventListener('scroll', _.throttle(this.onScroll, 200))
    },

  }
</script>