<template>
  <li>{{ bookmark }}</li>
</template>

<script>
  export default {
    name: 'bookmark-row',
    props: {
      bookmark: String
    }
  }
</script>