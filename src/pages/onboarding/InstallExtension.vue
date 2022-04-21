<template>
  <div class="flex flex-col lg:items-center">
    <h3 class="mt-12 mb-8 text-2xl font-bold text-gray-800 lg:text-3xl">
      Install extension
    </h3>
    <p class="mb-4 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      You would need the extension to start saving your tabs.
    </p>
    <p class="mb-4 text-base text-gray-700 lg:w-3/4 lg:text-xl">
      Click below to install the official Chrome extension for Savory from
      Chrome Web Store.
    </p>
    <a :href="installUrl" target="_blank" class="mt-4"
      ><img
        src="https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png"
        alt="install extension"
    /></a>
  </div>
</template>

<script setup>
import { chromeWebStoreUrl } from '../../lib/onboarding'
import { EVENT_ONBOARDING_INSTALL_EXT, eventLogger } from '../../api/events'
import { onMounted } from 'vue'

const installUrl = chromeWebStoreUrl

onMounted(() => {
  eventLogger.logEvent(EVENT_ONBOARDING_INSTALL_EXT)
})
</script>
