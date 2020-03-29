<template>
  <div>
    <ol>
      <li class="mb-2" v-for="id in current" :key="id">
        <BookmarkRow :bookmark-id="id"/>
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
      BookmarkLoader
    },

    data: function () {
      return {
        current: this.$store.getters.activeIds,
        bottom: false
      }
    },

    beforeRouteEnter (to, from, next) {
      store.dispatch({
        type: 'FETCH_DATA_FOR_APP_VIEW',
        name: to.name,
        params: to.params
      }).then(next)
    },

    beforeRouteUpdate (to, from, next) {
      store.dispatch({
        type: 'FETCH_DATA_FOR_APP_VIEW',
        name: to.name,
        params: to.params
      }).then(next)
    },

    methods: {
      setBookmarks () {
        this.current = this.$store.getters.activeIds
      },
      loadBookmarks () {
        this.bottom = true
        this.$store.dispatch('LOAD_MORE_BOOKMARKS').then(() => {
          this.setBookmarks()
          this.bottom = false
        })
      }
    },

    created () {
      Event.$on('newItems', this.setBookmarks)
      Event.$on('loadItems', this.loadBookmarks)
    },

    destroyed() {
      Event.$off('newItems', this.setBookmarks)
      Event.$off('loadItems', this.loadBookmarks)
    },

    watch: {
      '$route' (to) {
        const matched = this.$router.getMatchedComponents(to)
        if (matched.some(({ name }) => name === componentName)) {
          const history = window.history
          if (history.state && history.state.page) {
            this.$store.commit('SET_PAGE', history.state.page)
          }
          this.setBookmarks()
        }
      }
    },

  }
</script>
