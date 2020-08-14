<template>
  <div id="app">
    <div
      v-if="this.$auth.loading"
      class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
    >
      <LoadingSpinner />
    </div>
    <component v-else :is="this.$route.meta.layout || 'div'">
      <router-view />
    </component>
  </div>
</template>

<script>
import LoadingSpinner from './components/LoadingSpinner.vue'
import { store } from './store'

export default {
  name: 'app',

  components: {
    LoadingSpinner,
  },

  created() {
    if (this.$auth.isAuthenticated) {
      store.dispatch('SYNC_BOOKMARKS')
    }
  },
}
</script>

<style src="./assets/app.css"></style>
