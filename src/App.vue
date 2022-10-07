<template>
  <component :is="route.meta.layout || 'div'">
    <router-view />
  </component>
</template>

<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<style src="./assets/app.css"></style>
