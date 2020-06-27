<template>
  <div class="flex flex-col">
    <header class="flex bg-grey-300 flex-shrink-0 sticky top-0 z-10">
      <div class="w-64 flex-shrink-0 px-4 py-3">
        <router-link to="/u">
          <img
            class="block w-32 ml-6"
            src="../assets/logo_light.svg"
            alt="logo"
          />
        </router-link>
      </div>
      <div class="flex-1 flex items-center justify-between px-6">
        <div class="w-full max-w-lg">
          <SearchBar ref="searchInput"></SearchBar>
        </div>
        <div v-if="!$auth.loading" class="text-xs text-muted">
          <button v-if="!$auth.isAuthenticated" @click="login">Sign In</button>
          <button v-if="$auth.isAuthenticated" @click="logout">Sign Out</button>
        </div>
      </div>
    </header>
    <div class="flex flex-1">
      <div class="w-64 pt-6 pl-8 flex-shrink-0">
        <SideBar class="fixed" />
      </div>
      <main class="flex-1">
        <div class="px-6 mt-4 w-full max-w-3xl">
          <slot></slot>
        </div>
      </main>
      <div class="w-64 pt-6 flex-shrink-0">
        <RightBar />
      </div>
    </div>
  </div>
</template>

<script>
import SearchBar from '../components/SearchBar.vue'
import SideBar from '../components/SideBar.vue'
import RightBar from '../components/RightBar.vue'
import _ from 'lodash'

export default {
  name: 'app-layout',

  components: {
    SearchBar,
    SideBar,
    RightBar,
  },

  data: function () {
    return {
      version: process.env.VERSION,
    }
  },

  computed: {
    hasMore() {
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
      const bottomOfPage = visible + scrollY >= 0.9 * pageHeight
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
    },
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
