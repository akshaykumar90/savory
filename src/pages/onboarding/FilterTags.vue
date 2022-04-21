<template>
  <div class="flex flex-col lg:items-center">
    <h3 class="mt-12 mb-8 text-2xl font-bold text-gray-800 lg:text-3xl">
      Click any tag to enter filter view
    </h3>
    <p class="mb-4 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      Refine your search by adding more tags to the filter.
    </p>
    <div class="my-10 lg:p-8">
      <div class="inline-block border border-primary drop-shadow-md filter">
        <video autoplay loop muted playsinline width="700">
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1627742184/app/onboarding/savory_-_filter_nmgueg.webm"
            type="video/webm"
          />
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1627741722/app/onboarding/savory_-_filter_fdckj9.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EVENT_ONBOARDING_FILTER_TAGS, eventLogger } from '../../api/events'
import { onMounted } from 'vue'

onMounted(() => {
  eventLogger.logEvent(EVENT_ONBOARDING_FILTER_TAGS)
})
</script>
