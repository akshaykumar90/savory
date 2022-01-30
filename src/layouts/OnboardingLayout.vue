<template>
  <div class="mx-4 max-w-3xl lg:mx-auto lg:py-8 lg:text-center">
    <ProgressBar ref="bar" />
    <router-view />
    <nav>
      <router-link
        v-if="current < total"
        :to="`/welcome/${current + 1}`"
        tag="button"
        class="mt-4 inline-block select-none rounded bg-primary py-2 px-4 text-lg tracking-wide text-white hover:bg-blue-700 focus:outline-none"
      >
        Next →
      </router-link>
      <p class="mt-4 text-xs leading-5 text-gray-700">
        <router-link to="/" tag="button" class="underline">
          Skip Tour
        </router-link>
      </p>
    </nav>
  </div>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue'
import { getPosition, totalScreensNum } from '../lib/onboarding'

export default {
  name: 'onboarding-layout',

  components: {
    ProgressBar,
  },

  computed: {
    current() {
      return getPosition(this.$route.name)
    },
    total() {
      return totalScreensNum
    },
  },

  methods: {
    setProgressBarPosition() {
      const percent = 100 * (this.current / this.total)
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
