<template>
  <div class="spinner sk-bounce">
    <div class="sk-bounce-dot"></div>
    <div class="sk-bounce-dot"></div>
  </div>
</template>

<script>
export default {
  name: 'loading-spinner'
}
</script>

<style scoped>
.spinner {
  --sk-color: var(--color-primary);
}
</style>
