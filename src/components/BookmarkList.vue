<template>
  <div>
    <ol>
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
  import { store } from '../store'

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
      }
    },

    beforeRouteEnter (to, from, next) {
      store.dispatch({
        type: 'UPDATE_APP_VIEW',
        name: to.name,
        params: to.params
      }).then(next)
    },

    beforeRouteUpdate (to, from, next) {
      store.dispatch({
        type: 'UPDATE_APP_VIEW',
        name: to.name,
        params: to.params
      }).then(next)
    },

    methods: {
      onBottomVisibleUpdate ({ isVisible }) {
        this.bottom = isVisible
      }
    },

    created () {
      Event.$on('bottomVisible', this.onBottomVisibleUpdate)
    },

    destroyed() {
      Event.$off('bottomVisible', this.onBottomVisibleUpdate)
    },

  }
</script>
