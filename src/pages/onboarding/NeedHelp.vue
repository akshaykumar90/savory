<template>
  <div class="flex flex-col lg:items-center">
    <h3 class="mt-12 mb-8 text-2xl font-bold text-gray-800 lg:text-3xl">
      Need help?
    </h3>
    <p class="mb-12 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      If you have a question or want to submit any feedback, use the
      <img
        class="inline h-12"
        src="https://res.cloudinary.com/savory/image/upload/v1628437717/app/onboarding/feedback-btn_fspsua.png"
        alt="Bugs & Feedback"
      />
      button in the bottom right corner of the app.
    </p>
  </div>
</template>

<script>
import { EVENT_ONBOARDING_NEED_HELP, eventLogger } from '../../api/events'

export default {
  name: 'onboarding-need-help',

  mounted() {
    eventLogger.logEvent(EVENT_ONBOARDING_NEED_HELP)
  },
}
</script>
