<template>
  <div id="app">
    <!--
    FIXME: This is not a general purpose spinner. We are relying on
    `this.$route` to be unresolved to show the spinner. Therefore, we can only
    ever show the spinner on first load, since it will always have some route
    after that point?
    -->
    <div v-if="!this.$route.name" class="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
      <LoadingSpinner/>
    </div>
    <component :is="this.$route.meta.layout || 'div'">
      <router-view/>
    </component>
  </div>
</template>

<script>
import { loadUserData, markBookmarksImported, mongoApp } from './api/mongodb'
import LoadingSpinner from './components/LoadingSpinner.vue'

export default {
  name: 'app',

  components: {
    LoadingSpinner
  },

  methods: {
    syncBookmarks() {
      this.$store.dispatch({
        type: 'SYNC_BOOKMARKS',
        num: 5000
      })
    },
    async firstLogin() {
      const userData = await loadUserData()
      if (!userData || !userData.is_chrome_imported) {
        await this.$store.dispatch('IMPORT_BROWSER_BOOKMARKS')
        await markBookmarksImported()
      }
      this.syncBookmarks()
    }
  },

  created() {
    const { auth } = mongoApp
    if (auth.isLoggedIn) {
      this.syncBookmarks()
    }
    auth.addAuthListener({
      onUserLoggedIn: this.firstLogin
    })
  }
}
</script>

<style src="./assets/app.css">
</style>
