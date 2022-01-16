<template>
  <component :is="this.$route.meta.layout || 'div'">
    <router-view />
  </component>
</template>

<script setup>
import { useQueryProvider } from 'vue-query'

useQueryProvider()
</script>

<style src="./assets/app.css"></style>
