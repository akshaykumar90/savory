<template>
  <div id="app">
    <ol>
      <BookmarkRow
        v-for="item in bookmarks"
        v-bind:bookmark="item"
        v-bind:key="item.id">
      </BookmarkRow>
    </ol>
  </div>
</template>

<script>
  import BookmarkRow from './components/BookmarkRow.vue'

  export default {
    name: 'app',
    data: function () {
      return {
        bookmarks: [],
      }
    },
    components: {
      BookmarkRow
    },
    created: function () {
      // Alias the component instance as `vm`, so that we
      // can access it inside the promise function
      var vm = this
      // Fetch recent bookmarks from chrome API
      chrome.bookmarks.getRecent(5, function (results) {
        for (var node of results) {
          vm.bookmarks.push({'id': node.id, 'title': node.title, 'site': node.url})
        }
      })
    }
  }
</script>

<style lang="stylus">
  @import '~normalize.css';
</style>
