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
          <button v-if="false" @click="printTakeoutData">Takeout</button>
        </nav>
      </div>
      <div class="px-4 w-4/5">
        <SearchBar ref="searchInput" class="relative mb-4"></SearchBar>
        <component v-bind:is="currentView"></component>
      </div>
    </div>
  </div>
</template>

<script>
  import BookmarkList from './components/BookmarkList.vue'
  import SearchBar from './components/SearchBar.vue'
  import LinkList from './components/LinkList.vue'

  export default {
    name: 'app',

    components: {
      LinkList,
      BookmarkList,
      SearchBar,
    },

    computed: {
      numBookmarks () {
        return this.$store.getters.numBookmarks
      },
      pluralized () {
        return this.numBookmarks === 1 ? 'Bookmark' : 'Bookmarks'
      },
      currentView () {
        let type = this.$store.state.activeType
        return type === 'listicle' ? 'LinkList' : 'BookmarkList'
      }
    },

    methods: {
      printTakeoutData() {
        console.log(this.$store.getters.tagsJson)
      }
    },

    created () {
      this.$store.dispatch({
        type: 'FETCH_BOOKMARKS',
        num: 5000
      })
    },

    mounted() {
      this.$refs.searchInput.focus()
    },

    watch: {
      '$route' (to) {
        this.$store.dispatch({
          type: 'ON_ROUTE_CHANGE',
          name: this.$route.name,
          params: this.$route.params
        })
      }
    },
  }
</script>

<style src="./assets/app.css">
</style>
