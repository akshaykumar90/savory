<template>
  <button class="bg-grey-lighter text-teal-dark p-1 mr-2 text-center text-xs rounded border border-teal-dark focus:outline-none">
    <slot></slot>
  </button>
</template>

<script>
  export default {
    name: 'tag-button',
  }
</script>
