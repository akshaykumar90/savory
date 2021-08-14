<template>
  <div class="flex flex-col items-center">
    <h3 class="font-bold text-2xl lg:text-3xl mt-12 mb-8 text-gray-800">
      Welcome to Savory! Let’s get started.
    </h3>
    <p class="text-base lg:text-xl text-gray-700 mb-4 lg:w-3/4">
      Saving your current tab for later is as simple as clicking the star icon
      in Chrome. You will find your tabs safe and sound in your Savory
      collection.
    </p>
    <div class="lg:p-8 my-10">
      <div class="border border-primary filter drop-shadow-md">
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

<script>
import { EVENT_ONBOARDING_SAVE_LINK, eventLogger } from '../../api/events'

export default {
  name: 'onboarding-save-link',

  mounted() {
    eventLogger.logEvent(EVENT_ONBOARDING_SAVE_LINK)
  },
}
</script>
