<template>
  <div class="flex flex-col items-center text-center py-8">
    <h3 class="text-3xl mt-12 mb-8 text-gray-800">
      Click any tag to enter filter view
    </h3>
    <p class="text-xl text-gray-700 mb-4 w-3/4">
      Filter view allows drilling into your collection.
    </p>
    <div
      class="
        pattern-diagonal-lines-md
        bg-blue-100 bg-opacity-70
        text-indigo-300
        p-8
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
  name: 'onboarding-filter-tags',
}
</script>
