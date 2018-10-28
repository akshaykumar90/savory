<template>
  <div id="app" class="min-h-screen font-serif">
    <div class="flex justify-between container mx-auto px-6 py-8">
      <div class="px-4 w-1/5">
        <h1 class="text-2xl">Savory</h1>
        <nav class="py-2">
          <span class="text-lg font-bold">{{bookmarks.length}}</span>
          <span class="text-xs mx-1">Bookmarks</span>
        </nav>
      </div>
      <div class="px-4 w-4/5">
        <ol class="list-reset text-sm font-medium">
          <BookmarkRow
            v-for="item in bookmarks"
            v-bind:bookmark="item"
            v-bind:key="item.id">
          </BookmarkRow>
        </ol>
      </div>
    </div>
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
      const vm = this;
      // Fetch recent bookmarks from chrome API
      chrome.bookmarks.getRecent(200, function (results) {
        for (var node of results) {
          vm.bookmarks.push({'id': node.id, 'title': node.title, 'site': node.url})
        }
      })
    }
  }
</script>

<style>
@tailwind preflight;
@tailwind components;
@tailwind utilities;
</style>
