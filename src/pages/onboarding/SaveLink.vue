<template>
  <div class="flex flex-col items-center">
    <h3 class="font-bold text-2xl lg:text-3xl mt-12 mb-8 text-gray-800">
      Welcome to Savory! Let’s get started.
    </h3>
    <p class="text-lg lg:text-xl text-gray-700 mb-4 lg:w-3/4">
      To save your tabs and links in Chrome, click the star icon. It will add
      the current tab to your Savory collection. It will also add it to your
      Chrome bookmarks which can be safely deleted.
    </p>
    <div class="lg:p-8 my-10">
      <div class="border border-primary filter drop-shadow-md">
        <video autoplay loop muted playsinline width="700">
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1627742184/app/onboarding/savory_-_save_link_p51qyi.webm"
            type="video/webm"
          />
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1627741716/app/onboarding/savory_-_save_link_o9ouah.mp4"
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
