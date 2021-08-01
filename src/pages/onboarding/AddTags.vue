<template>
  <div class="flex flex-col items-center">
    <h3 class="font-bold text-2xl lg:text-3xl mt-12 mb-8 text-gray-800">
      Add tags to your saved links
    </h3>
    <p class="text-lg lg:text-xl text-gray-700 mb-4 lg:w-3/4">
      Organize your tabs and links by adding tags. Use <kbd>enter</kbd> to add
      new tag, use <kbd>tab</kbd> to auto-complete tags.
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
      <button @click.prevent="$emit('exit-product-tour')" class="underline">
        Skip Tour
      </button>
    </p>
  </div>
</template>

<script>
export default {
  name: 'onboarding-add-tags',
}
</script>
