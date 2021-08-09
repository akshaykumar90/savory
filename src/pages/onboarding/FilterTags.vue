<template>
  <div class="flex flex-col items-center">
    <h3 class="font-bold text-2xl lg:text-3xl mt-12 mb-8 text-gray-800">
      Click any tag to enter filter view
    </h3>
    <p class="text-lg lg:text-xl text-gray-700 mb-4 lg:w-3/4">
      Filter view allows drilling into your collection.
    </p>
    <div
      class="
        pattern-diagonal-lines-md
        bg-blue-100 bg-opacity-70
        text-indigo-300
        lg:p-8
        my-10
      "
    >
      <div class="border border-primary filter drop-shadow-md">
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

<script>
import { EVENT_ONBOARDING_FILTER_TAGS, eventLogger } from '../../api/events'

export default {
  name: 'onboarding-filter-tags',

  mounted() {
    eventLogger.logEvent(EVENT_ONBOARDING_FILTER_TAGS)
  },
}
</script>
