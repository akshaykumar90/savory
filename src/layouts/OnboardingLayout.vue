<template>
  <div class="max-w-3xl mx-auto text-center lg:py-8">
    <ProgressBar ref="bar" />
    <router-view />
    <nav>
      <router-link
        v-if="current < total"
        :to="`/welcome/${current + 1}`"
        tag="button"
        class="
          inline-block
          mt-4
          bg-primary
          hover:bg-blue-700
          text-lg
          tracking-wide
          text-white
          py-2
          px-4
          rounded
          select-none
          focus:outline-none
        "
      >
        Next →
      </router-link>
      <p class="text-xs leading-5 mt-4 text-gray-700">
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
