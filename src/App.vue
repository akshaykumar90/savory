<template>
  <div id="app" class="min-h-screen font-serif">
    <div class="flex justify-between container mx-auto px-6 py-8">
      <div class="px-4 w-1/5">
        <h1 class="text-2xl"><router-link to="/">Savory</router-link></h1>
        <nav class="py-2">
          <span class="text-lg font-bold">{{ numBookmarks }}</span>
          <span class="text-xs mx-1">Bookmarks</span>
          <div class="flex flex-col items-start mt-2">
            <TagButton class="mb-1" v-for="(name, index) in filters" :key="index">
              <span>{{ name }}</span>
            </TagButton>
          </div>
        </nav>
      </div>
      <div class="px-4 w-4/5">
        <SearchBar class="relative mb-4"></SearchBar>
        <BookmarkList></BookmarkList>
      </div>
    </div>
  </div>
</template>

<script>
  import BookmarkList from './components/BookmarkList.vue'
  import SearchBar from './components/SearchBar.vue'
  import TagButton from './components/TagButton.vue'

  export default {
    name: 'app',

    components: {
      BookmarkList,
      SearchBar,
      TagButton
    },

    computed: {
      numBookmarks () {
        let type = this.$store.state.activeType
        return this.$store.state.lists[type].length
      },
      filters: function () {
        return this.$store.state.filters;
      }
    },

    created () {
      this.$store.dispatch({
        type: 'FETCH_BOOKMARKS',
        num: 5000
      })
    },

    watch: {
      '$route' (to) {
        this.$store.dispatch({
          type: 'ON_ROUTE_CHANGE',
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
