<template>
  <div id="app">
    <component :is="this.$route.meta.layout || 'div'">
      <router-view/>
    </component>
  </div>
</template>

<script>
  import {
    loadUserData,
    markBookmarksImported,
    mongoApp
  } from './api/mongodb'

  export default {
    name: 'app',

    methods: {
      syncBookmarks () {
        this.$store.dispatch({
          type: 'SYNC_BOOKMARKS',
          num: 5000
        })
      },
      async firstLogin () {
        const userData = await loadUserData()
        if (!userData || !userData.is_chrome_imported) {
          await this.$store.dispatch('IMPORT_BROWSER_BOOKMARKS')
          await markBookmarksImported()
        }
        this.syncBookmarks()
      }
    },

    created () {
      const { auth } = mongoApp
      if (auth.isLoggedIn) {
        this.syncBookmarks()
      }
      auth.addAuthListener({
        onUserLoggedIn: this.firstLogin,
      })
    },
  }
</script>

<style src="./assets/app.css">
</style>
