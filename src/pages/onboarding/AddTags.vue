<template>
  <div class="flex flex-col lg:items-center">
    <h3 class="mt-12 mb-8 text-2xl font-bold text-gray-800 lg:text-3xl">
      Tags go well with tabs
    </h3>
    <p class="mb-4 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      Organize your saved tabs and bookmarks by adding tags.
    </p>
    <p class="mb-4 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      Press <kbd>enter</kbd> to add a new tag, use <kbd>tab</kbd> to
      auto-complete existing tags.
    </p>
    <div class="my-10 lg:p-8">
      <div class="inline-block border border-primary drop-shadow-md filter">
        <video autoplay loop muted playsinline width="700">
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1627742184/app/onboarding/savory_-_add_tag_g4qvm0.webm"
            type="video/webm"
          />
          <source
            src="https://res.cloudinary.com/savory/video/upload/v1627741715/app/onboarding/savory_-_add_tag_lomple.mp4"
            type="video/mp4"
          />
        </video>
      </div>
    </div>
  </div>
</template>

<script setup>
import { EVENT_ONBOARDING_ADD_TAGS, eventLogger } from '../../api/events'
import { onMounted } from 'vue'

onMounted(() => {
  eventLogger.logEvent(EVENT_ONBOARDING_ADD_TAGS)
})
</script>
