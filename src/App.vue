<template>
  <div id="app" class="min-h-screen font-serif">
    <div class="flex justify-between container mx-auto px-6 py-8">
      <div class="px-4 w-1/5">
        <h1 class="text-2xl">Savory</h1>
        <nav class="py-2">
          <span class="text-lg font-bold">{{ numBookmarks }}</span>
          <span class="text-xs mx-1">Bookmarks</span>
        </nav>
      </div>
      <div class="px-4 w-4/5">
        <BookmarkList></BookmarkList>
      </div>
    </div>
  </div>
</template>

<script>
  import BookmarkList from './components/BookmarkList.vue'

  export default {
    name: 'app',

    components: {
      BookmarkList
    },

    computed: {
      numBookmarks () {
        let type = this.$store.state.activeType
        return this.$store.state.lists[type].length
      },
    },

    created () {
      this.$store.dispatch({
        type: 'FETCH_BOOKMARKS',
        num: 500
      })
    },

    watch: {
      '$route' (to) {
        this.$store.dispatch({
          type: 'FILTER_BY_TAG',
          params: this.$route.params
        })
      }
    },
  }
</script>

<style>
@tailwind preflight;
@tailwind components;
@tailwind utilities;
</style>
