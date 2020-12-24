<template>
  <div>
    <header
      class="sticky top-0 z-10 shadow"
      v-bind:class="[testMode ? 'bg-yellow-300' : 'bg-grey-300']"
    >
      <div class="w-full md:max-w-7xl mx-auto py-1 md:py-2">
        <div
          class="grid place-content-center md:grid-cols-10 items-center md:gap-x-4"
        >
          <div class="md:col-span-2">
            <router-link to="/">
              <img
                class="w-24 md:w-32 md:ml-6"
                src="../assets/logo_light.svg"
                alt="logo"
              />
            </router-link>
          </div>
          <div class="hidden md:block md:col-span-4">
            <SearchBar ref="searchInput"></SearchBar>
          </div>
          <div
            v-if="!$auth.loading"
            class="hidden md:block md:col-start-10 md:justify-self-end text-xs text-muted mr-4"
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
    <div class="w-full md:max-w-7xl mx-auto">
      <div class="md:grid md:grid-cols-10 md:gap-x-4">
        <div class="pt-6 pl-8 hidden md:col-span-2 md:block">
          <SideBar class="sticky top-24" />
        </div>
        <main class="md:col-span-5 md:mt-3">
          <slot></slot>
        </main>
        <div class="pt-6 hidden md:col-start-9 md:col-span-2 md:block">
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
    onKeydown(e) {
      if (e.key === 'k' && (e.ctrlKey || e.metaKey)) {
        this.$refs.searchInput.focus()
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
    window.removeEventListener('keydown', this.onKeydown)
  },

  mounted() {
    this.scrollHandler = _.throttle(this.onScroll, 200)
    window.addEventListener('scroll', this.scrollHandler)
    window.addEventListener('keydown', this.onKeydown)
    this.$refs.searchInput.focus()
  },

  created() {
    this.$store.dispatch('FETCH_TAGS_COUNT')
  },
}
</script>
