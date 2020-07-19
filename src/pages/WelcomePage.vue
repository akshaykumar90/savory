<template>
  <ProgressBar ref="bar" />
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue'
import {
  loadUserData,
  markBookmarksImported,
  stitchLoggedIn,
} from '../api/mongodb'

export default {
  name: 'welcome-page',

  components: {
    ProgressBar,
  },

  async mounted() {
    this.$refs.bar.set(5)
    await stitchLoggedIn()
    this.$refs.bar.increase(10)
    const userData = await loadUserData()
    this.$refs.bar.increase(10)
    const importStartPercent = 25
    const importFinishPercent = 90
    this.unwatch = this.$store.watch(
      (state) => state.browser.importPercent,
      (newValue) => {
        this.$refs.bar.set(
          importStartPercent +
            newValue * (importFinishPercent - importStartPercent)
        )
      }
    )
    if (!userData || !userData.is_chrome_imported) {
      await this.$store.dispatch('IMPORT_BROWSER_BOOKMARKS')
      this.$refs.bar.set(90)
      await markBookmarksImported()
    }
    this.$refs.bar.finish()
    this.$store.dispatch('SYNC_BOOKMARKS')
    this.$router.push({ name: 'app' })
  },

  beforeDestroy() {
    this.unwatch()
  },
}
</script>
