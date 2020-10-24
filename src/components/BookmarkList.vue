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
import { store } from '../store'

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
  },

  data: function () {
    return {
      current: this.$store.getters.activeIds,
    }
  },

  beforeRouteEnter(to, from, next) {
    store
      .dispatch({
        type: 'FETCH_DATA_FOR_APP_VIEW',
        name: to.name,
        params: to.params,
      })
      .then(next)
  },

  beforeRouteUpdate(to, from, next) {
    store
      .dispatch({
        type: 'FETCH_DATA_FOR_APP_VIEW',
        name: to.name,
        params: to.params,
      })
      .then(next)
  },

  methods: {
    setBookmarks() {
      this.current = this.$store.getters.activeIds
    },
  },

  created() {
    Event.$on('newItems', this.setBookmarks)
  },

  destroyed() {
    Event.$off('newItems', this.setBookmarks)
  },

  watch: {
    $route(to) {
      const matched = this.$router.getMatchedComponents(to)
      if (matched.some(({ name }) => name === componentName)) {
        const history = window.history
        if (history.state && history.state.page) {
          this.$store.commit('SET_PAGE', history.state.page)
        }
        this.setBookmarks()
      }
    },
  },
}
</script>
