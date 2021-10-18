<template>
  <div>
    <ol>
      <li
        class="px-4 py-2 md:px-0 md:py-1 border-b md:border-0"
        v-for="id in current"
        :key="id"
      >
        <BookmarkRow :bookmark-id="id" />
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

const componentName = 'BookmarkList'

export default {
  name: componentName,

  components: {
    BookmarkRow,
    BookmarkLoader,
  },

  computed: {
    bottom() {
      return this.$store.state.list.loading
    },
    current() {
      return this.$store.getters.activeIds
    },
  },

  created() {
    this.$store.dispatch({
      type: 'FETCH_DATA_FOR_ROUTE',
      route: this.$router.currentRoute,
    })
  },

  watch: {
    $route(to) {
      // TODO: https://next.router.vuejs.org/guide/migration/#removal-of-router-getmatchedcomponents
      const matched = this.$router.getMatchedComponents(to)
      if (matched.some(({ name }) => name === componentName)) {
        this.$store.dispatch({
          type: 'FETCH_DATA_FOR_ROUTE',
          route: to,
        })
      }
    },
  },
}
</script>
