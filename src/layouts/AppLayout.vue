<template>
  <div>
    <header
      class="sticky top-0 z-10"
      v-bind:class="[testMode ? 'bg-yellow-300' : 'bg-grey-300']"
    >
      <div class="max-w-7xl mx-auto py-2">
        <div class="grid grid-cols-10 items-center gap-x-4">
          <div class="col-span-2">
            <router-link to="/">
              <img
                class="w-32 ml-6"
                src="../assets/logo_light.svg"
                alt="logo"
              />
            </router-link>
          </div>
          <div class="col-span-4">
            <SearchBar ref="searchInput"></SearchBar>
          </div>
          <div
            v-if="!$auth.loading"
            class="col-start-10 justify-self-end text-xs text-muted mr-4"
          >
            <button v-if="!$auth.isAuthenticated" @click="login">
              Sign In
            </button>
            <button v-if="$auth.isAuthenticated" @click="logout">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </header>
    <div class="max-w-7xl mx-auto">
      <div class="grid grid-cols-10 gap-x-4">
        <div class="pt-6 pl-8 col-span-2">
          <SideBar />
        </div>
        <main class="col-span-5">
          <div class="mt-4">
            <slot></slot>
          </div>
        </main>
        <div class="pt-6 col-start-9 col-span-2">
          <RightBar />
        </div>
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

  computed: {
    hasMore() {
      return this.$store.state.list.page < this.$store.getters.maxPage
    },
    testMode() {
      return process.env.TEST_MODE === 'true'
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
        this.$store.dispatch('LOAD_MORE_BOOKMARKS')
      }
    },
    login() {
      // This is a stub. It should never happen. We cannot be in logged-out
      // state while AppLayout is rendered!
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

  created() {
    this.$store.dispatch('FETCH_TAGS_COUNT')
  },
}
</script>
