<template>
  <div id="app">
    <component :is="this.$route.meta.layout || 'div'">
      <router-view/>
    </component>
  </div>
</template>

<script>
  import { mongoApp } from './api/mongodb'

  export default {
    name: 'app',

    methods: {
      syncBookmarks () {
        this.$store.dispatch({
          type: 'SYNC_BOOKMARKS',
          num: 5000
        })
      }
    },

    created () {
      const { auth } = mongoApp
      if (auth.isLoggedIn) {
        this.syncBookmarks()
      }
      auth.addAuthListener({
        onUserLoggedIn: this.syncBookmarks,
      })
    },
  }
</script>

<style src="./assets/app.css">
</style>
