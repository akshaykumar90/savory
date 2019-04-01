<template>
  <div id="app" class="min-h-screen font-sans bg-default theme-light">
    <div class="flex justify-between container mx-auto px-6 py-8">
      <div class="px-4 w-1/5">
        <div>
          <router-link to="/">
            <img class="block w-64" src="./assets/logo_light.svg" alt="logo">
          </router-link>
        </div>
        <nav class="py-4">
          <p class="text-xs text-muted">{{ pluralized }}</p>
          <p class="text-2xl text-muted font-bold mt-2">{{ numBookmarks.toLocaleString('en') }}</p>
          <div class="flex flex-col items-start mt-2">
            <TagButton class="mb-1" v-for="(name, index) in filters" :key="index">
              <span>{{ name }}</span>
            </TagButton>
          </div>
        </nav>
      </div>
      <div class="px-4 w-4/5">
        <SearchBar class="relative mb-4"></SearchBar>
        <component v-bind:is="currentView"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import BookmarkList from './components/BookmarkList.vue'
  import SearchBar from './components/SearchBar.vue'
  import TagButton from './components/TagButton.vue'
  import LinkList from './components/LinkList.vue'

  export default {
    name: 'app',

    components: {
      LinkList,
      BookmarkList,
      SearchBar,
      TagButton
    },

    computed: {
      numBookmarks () {
        return this.$store.getters.numBookmarks
      },
      pluralized () {
        return this.numBookmarks === 1 ? 'Bookmark' : 'Bookmarks'
      },
      filters: function () {
        return this.$store.state.filters;
      },
      currentView () {
        let type = this.$store.state.activeType
        return type === 'listicle' ? 'LinkList' : 'BookmarkList'
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

<style src="./assets/app.css">
</style>
