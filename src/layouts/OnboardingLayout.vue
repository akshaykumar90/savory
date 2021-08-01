<template>
  <div>
    <ProgressBar ref="bar" />
    <div class="max-w-3xl mx-auto text-center lg:py-8">
      <router-view
        v-on:tour-continue="nextScreen"
        v-on:exit-product-tour="exitOnboarding"
      ></router-view>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue'
import SaveLink from '../pages/onboarding/SaveLink.vue'

export default {
  name: 'onboarding-layout',

  components: {
    ProgressBar,
    SaveLink,
  },

  methods: {
    nextScreen() {
      console.log('next screen')
    },
    exitOnboarding() {
      console.log('exit onboarding')
    },
  },
}
</script>
