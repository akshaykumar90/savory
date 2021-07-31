<template>
  <div class="flex flex-col items-center text-center py-8">
    <h3 class="text-3xl mt-12 mb-8 text-gray-800">Install extension</h3>
    <p class="text-xl text-gray-700 mb-4 w-3/4">
      You need the extension to save your tabs. Click below to install the
      extension from the official Chrome Web Store.
    </p>
    <a href=""
      ><img
        src="https://storage.googleapis.com/chrome-gcs-uploader.appspot.com/image/WlD8wC6g8khYWPJUsQceQkhXSlv1/UV4C4ybeBTsZt43U4xis.png"
        alt="install extension"
    /></a>
    <p class="text-xs leading-5 mt-4 text-gray-700">
      <a href="#" @click.prevent="$emit('exit-product-tour')" class="underline"
        >Skip</a
      >
    </p>
  </div>
</template>

<script>
export default {
  name: 'onboarding-install-extension',
}
</script>
