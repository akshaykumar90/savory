<template>
  <li>{{ bookmark.title }} • {{ bookmark.site }}</li>
</template>

<script>
  export default {
    name: 'bookmark-row',
    props: {
      bookmark: Object
    }
  }
</script>