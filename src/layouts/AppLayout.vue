<template>
  <div>
    <TopNav
      :test-mode="testMode"
      :is-saving="isSaving"
      v-on:onLogout="logout"
    ></TopNav>
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
import SideBar from '../components/SideBar.vue'
import RightBar from '../components/RightBar.vue'
import TopNav from '../components/TopNav.vue'
import _ from 'lodash'

export default {
  name: 'app-layout',

  components: {
    SideBar,
    RightBar,
    TopNav,
  },

  computed: {
    hasMore() {
      return this.$store.state.list.page < this.$store.getters.maxPage
    },
    testMode() {
      return process.env.TEST_MODE === 'true'
    },
    isSaving() {
      return this.$store.state.list.save.pending
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
    onClickOutside() {
      // Clicking outside tags row input should exit edit mode
      // Inspired from: https://stackoverflow.com/a/36180348/7003143
      // Also see `collapseSiblings` in TagsRow.vue
      Event.$emit('exitEditMode', {})
    },
    beforeUnload(event) {
      if (this.$store.state.list.save.pending) {
        // Cancel the event as stated by the standard.
        event.preventDefault()
        // Older browsers supported custom message
        return (event.returnValue =
          'There is pending work. Sure you want to leave?')
      }
    },
    logout() {
      this.$auth.logout()
    },
  },

  destroyed() {
    window.removeEventListener('scroll', this.scrollHandler)
    window.removeEventListener('keydown', this.onKeydown)
    document.body.removeEventListener('click', this.onClickOutside)
  },

  mounted() {
    this.scrollHandler = _.throttle(this.onScroll, 200)
    window.addEventListener('scroll', this.scrollHandler)
    window.addEventListener('keydown', this.onKeydown)
    document.body.addEventListener('click', this.onClickOutside)
    window.addEventListener('beforeunload', this.beforeUnload)
  },

  created() {
    this.$store.dispatch('FETCH_TAGS_COUNT')
  },
}
</script>
