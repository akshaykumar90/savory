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

<script setup>
import ProgressBar from '../components/ProgressBar.vue'
import { totalScreensNum } from '../lib/onboarding'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const current = computed(() => route.meta.position + 1)
const total = totalScreensNum

const bar = ref(null)

const setProgressBarPosition = () => {
  const percent = 100 * (current.value / total)
  bar.value.set(percent)
}

onMounted(() => {
  setProgressBarPosition()
})

watch(
  () => route.name,
  () => setProgressBarPosition()
)
</script>
