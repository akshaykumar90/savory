<template>
  <button class="bg-grey-100 text-primary p-1 mr-2 text-center text-xs rounded border border-primary focus:outline-none">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'tag-button',
  }
</script>
