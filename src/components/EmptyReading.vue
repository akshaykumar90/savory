<template>
  <EmptyState :title="title">
    {{ description }}
  </EmptyState>
</template>

<script setup>
import EmptyState from './EmptyState.vue'

const title = 'Your reading list is empty.'
const description =
  'Add the "reading" tag to any saved item and it will show up here!'
</script>
