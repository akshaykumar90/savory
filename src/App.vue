<template>
  <router-view />
  <VueQueryDevTools :initialIsOpen="true" />
</template>

<script setup>
import { useQueryProvider } from 'vue-query'
import { VueQueryDevTools } from 'vue-query/devtools'

useQueryProvider()
</script>

<style src="./assets/app.css"></style>
