<template>
  <div id="app" class="min-h-screen font-serif">
    <div class="flex justify-between container mx-auto px-6 py-8">
      <div class="px-4 w-1/5">
        <h1 class="text-2xl">Savory</h1>
        <nav class="py-2">
          <span class="text-lg font-bold">{{recent.length}}</span>
          <span class="text-xs mx-1">Bookmarks</span>
        </nav>
      </div>
      <div class="px-4 w-4/5">
        <ol class="list-reset text-sm font-medium">
          <BookmarkRow
            v-for="item in recent"
            v-bind:bookmark-id="item"
            v-bind:key="item">
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

    components: {
      BookmarkRow
    },

    computed: {
      recent () {
        return this.$store.state.recent
      }
    },

    created () {
      this.$store.dispatch({
        type: 'FETCH_BOOKMARKS',
        num: 50
      })
    },

    watch: {
      '$route' (to) {
        const tagName = this.$route.params.tag.trim()
        console.log('Routing to:', tagName)
        this.$store.dispatch({
          type: 'FILTER_BY_TAG',
          tagName: tagName
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
