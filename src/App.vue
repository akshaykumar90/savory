<template>
  <div id="app">
    <ol>
      <BookmarkRow bookmark="Welcome to Your Vue.js App"/>
    </ol>
  </div>
</template>

<script>
  import BookmarkRow from './components/BookmarkRow.vue'

  export default {
    name: 'app',
    components: {
      BookmarkRow
    }
  }
</script>