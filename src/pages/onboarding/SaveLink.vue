<template>
  <div class="flex flex-col items-center text-center py-8">
    <h3 class="text-3xl mt-12 mb-8 text-gray-800">
      Welcome to Savory! Let’s get started.
    </h3>
    <p class="text-xl text-gray-700 mb-4 w-3/4">
      To save your tabs and links in Chrome, click the star icon. It will add
      the current tab to your Savory collection. It will also add it to your
      Chrome bookmarks which can be safely deleted.
    </p>
    <div class="p-8 my-10">
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
    <button
      class="
        mt-4
        bg-primary
        hover:bg-blue-700
        text-lg
        tracking-wide
        text-white
        py-2
        px-4
        rounded
        select-none
        focus:outline-none
      "
      @click="$emit('tour-continue')"
    >
      Next →
    </button>
    <p class="text-xs leading-5 mt-4 text-gray-700">
      <a href="#" @click.prevent="$emit('exit-product-tour')" class="underline"
        >Skip Tour</a
      >
    </p>
  </div>
</template>

<script>
export default {
  name: 'onboarding-save-link',
}
</script>
