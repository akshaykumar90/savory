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

    watch: {
      '$route' (to) {
        this.$store.dispatch({
          type: 'ON_ROUTE_CHANGE',
          name: this.$route.name,
          params: this.$route.params
        })
      }
    },
  }
</script>

<style src="./assets/app.css">
</style>
