<template>
  <div class="flex flex-col lg:items-center">
    <h3 class="mt-12 mb-8 text-2xl font-bold text-gray-800 lg:text-3xl">
      Welcome to Savory! Let’s get started.
    </h3>
    <p class="mb-4 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      Saving your current tab for later is as simple as clicking the star icon
      in Chrome. You will find your tabs safe and sound in your Savory
      collection.
    </p>
    <div class="my-10 lg:p-8">
      <div class="inline-block border border-primary drop-shadow-md filter">
        <video autoplay loop muted playsinline width="700">
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1628940683/app/onboarding/save_link_ewufc7.webm"
            type="video/webm"
          />
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1628940683/app/onboarding/save_link_pex3aj.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EVENT_ONBOARDING_SAVE_LINK, eventLogger } from '../../api/events'
import { onMounted } from 'vue'

onMounted(() => {
  eventLogger.logEvent(EVENT_ONBOARDING_SAVE_LINK)
})
</script>
