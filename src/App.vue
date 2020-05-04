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
import LoadingSpinner from './components/LoadingSpinner.vue'

export default {
  name: 'app',

  components: {
    LoadingSpinner
  }
}
</script>

<style src="./assets/app.css">
</style>
