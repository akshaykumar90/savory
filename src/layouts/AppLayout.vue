<template>
  <div class="flex flex-col">
    <header class="flex bg-grey-300 flex-shrink-0 sticky top-0 z-10">
      <div class="w-64 flex-shrink-0 px-4 py-3">
        <router-link to="/">
          <img class="block w-32 ml-6" src="../assets/logo_light.svg" alt="logo">
        </router-link>
      </div>
      <div class="flex-1 flex items-center justify-between px-6">
        <div class="w-full max-w-lg">
          <SearchBar ref="searchInput"></SearchBar>
        </div>
        <!-- Check that the SDK client is not currently loading before accessing is methods -->
        <div v-if="!$auth.loading">
          <!-- show login when not authenticated -->
          <button v-if="!$auth.isAuthenticated" @click="login">Log in</button>
          <!-- show logout when authenticated -->
          <button v-if="$auth.isAuthenticated" @click="logout">Log out</button>
        </div>
      </div>
    </header>
    <div class="flex flex-1">
      <div class="w-64 p-6 flex-shrink-0 ">
        <SideBar class="fixed"/>
      </div>
      <main class="flex-1">
        <div class="px-6 mt-4 w-full max-w-3xl">
          <slot></slot>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
  import SearchBar from '../components/SearchBar.vue'
  import SideBar from '../components/SideBar.vue'
  import _ from 'lodash'

  export default {
    name: 'app-layout',

    components: {
      SearchBar,
      SideBar,
    },

    computed: {
      hasMore () {
        return this.$store.state.page < this.$store.getters.maxPage
      },
    },

    methods: {
      bottomVisible() {
        const scrollY = window.scrollY
        const visible = document.documentElement.clientHeight
        const pageHeight = document.documentElement.scrollHeight
        // Some wiggle room (.9) to allow time to load content before user
        // reaches bottom
        const bottomOfPage = visible + scrollY >= .9 * pageHeight
        return bottomOfPage || pageHeight < visible
      },
      onScroll() {
        if (this.bottomVisible() && this.hasMore) {
          Event.$emit('loadItems')
        }
      },
      login() {
        this.$auth.loginWithPopup()
      },
      logout() {
        this.$auth.logout()
      }
    },

    destroyed() {
      window.removeEventListener('scroll', this.scrollHandler)
    },

    mounted() {
      this.scrollHandler = _.throttle(this.onScroll, 200)
      window.addEventListener('scroll', this.scrollHandler)
      this.$refs.searchInput.focus()
    },
  }
</script>
