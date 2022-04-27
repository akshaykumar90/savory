<template>
  <component :is="route.meta.layout || 'div'">
    <router-view />
  </component>
</template>

<script setup>
import { useQueryProvider } from 'vue-query'
import { useRoute } from 'vue-router'

const route = useRoute()

useQueryProvider()
</script>

<style src="./assets/app.css"></style>
