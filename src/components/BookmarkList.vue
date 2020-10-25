<template>
  <div>
    <ol>
      <li class="mb-2" v-for="id in current" :key="id">
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

  mounted() {
    this.$store.dispatch({
      type: 'FETCH_DATA_FOR_APP_VIEW',
      name: this.$router.currentRoute.name,
      params: this.$router.currentRoute.params,
    })
  },

  watch: {
    $route(to) {
      const matched = this.$router.getMatchedComponents(to)
      if (matched.some(({ name }) => name === componentName)) {
        this.$store.dispatch({
          type: 'FETCH_DATA_FOR_APP_VIEW',
          name: to.name,
          params: to.params,
        })
      }
    },
  },
}
</script>
