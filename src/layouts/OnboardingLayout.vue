<template>
  <div>
    <ProgressBar ref="bar" />
    <div class="max-w-3xl mx-auto text-center lg:py-8">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import ProgressBar from '../components/ProgressBar.vue'

export default {
  name: 'onboarding-layout',

  components: {
    ProgressBar,
  },
}
</script>
