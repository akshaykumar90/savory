<template>
  <div class="flex flex-col items-center">
    <h3 class="font-bold text-2xl lg:text-3xl mt-12 mb-8 text-gray-800">
      Install extension
    </h3>
    <p class="text-lg lg:text-xl text-gray-700 mb-4 lg:w-3/4">
      You need the extension to save your tabs. Click below to install the
      extension from the official Chrome Web Store.
    </p>
    <a :href="installUrl" target="_blank" class="mt-4"
      ><img
        src="https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png"
        alt="install extension"
    /></a>
  </div>
</template>

<script>
import { chromeWebStoreUrl } from '../../lib/onboarding'
import { EVENT_ONBOARDING_INSTALL_EXT, eventLogger } from '../../api/events'

export default {
  name: 'onboarding-install-extension',

  data: function () {
    return {
      installUrl: chromeWebStoreUrl,
    }
  },

  mounted() {
    eventLogger.logEvent(EVENT_ONBOARDING_INSTALL_EXT)
  },
}
</script>
