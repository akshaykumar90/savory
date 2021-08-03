<template>
  <div>
    <ProgressBar ref="bar" />
    <div class="max-w-3xl mx-auto text-center lg:py-8">
      <router-view />
    </div>
  </div>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue'
import { getProgress } from '../lib/onboarding'

export default {
  name: 'onboarding-layout',

  components: {
    ProgressBar,
  },

  methods: {
    setProgressBarPosition() {
      const percent = getProgress(this.$router.currentRoute.name)
      this.$refs.bar.set(percent)
    },
  },

  mounted() {
    this.setProgressBarPosition()
  },

  watch: {
    $route(to) {
      this.setProgressBarPosition()
    },
  },
}
</script>
