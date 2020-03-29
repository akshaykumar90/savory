<template>
  <div id="app">
    <component :is="this.$route.meta.layout || 'div'">
      <router-view/>
    </component>
  </div>
</template>

<script>
  export default {
    name: 'app',

    created () {
      this.$store.dispatch({
        type: 'SYNC_BOOKMARKS',
        num: 5000
      })
    },
  }
</script>

<style src="./assets/app.css">
</style>
