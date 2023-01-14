<template>
  <EmptyState :title="title">
    {{ description }}
  </EmptyState>
</template>

<script setup>
import EmptyState from './EmptyState.vue'

const title = 'Your playlist is empty.'
const description =
  'Add the "playlist" tag to any saved item and it will show up here!'
</script>
