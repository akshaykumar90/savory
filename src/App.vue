<template>
  <div id="app">
    <div v-if="this.$auth.loading" class="h-screen grid">
      <LoadingSpinner class="place-self-center" />
    </div>
    <component v-else :is="this.$route.meta.layout || 'div'">
      <router-view />
    </component>
  </div>
</template>

<script>
import LoadingSpinner from './components/LoadingSpinner.vue'

export default {
  name: 'app',

  components: {
    LoadingSpinner,
  },
}
</script>

<style src="./assets/app.css"></style>
