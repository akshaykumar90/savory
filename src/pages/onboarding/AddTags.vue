<template>
  <div class="flex flex-col items-center text-center py-8">
    <h3 class="text-3xl mt-12 mb-8 text-gray-800">
      Add tags to your saved links
    </h3>
    <p class="text-xl text-gray-700 mb-4 w-3/4">
      Organize your tabs and links by adding tags. Use <kbd>enter</kbd> to add
      new tag, use <kbd>tab</kbd> to auto-complete tags.
    </p>
    <video autoplay loop muted playsinline>
      <source
        src="https://res.cloudinary.com/savory/video/upload/v1627742184/app/onboarding/savory_-_add_tag_g4qvm0.webm"
        type="video/webm"
      />
      <source
        src="https://res.cloudinary.com/savory/video/upload/v1627741715/app/onboarding/savory_-_add_tag_lomple.mp4"
        type="video/mp4"
      />
    </video>
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
  name: 'onboarding-add-tags',
}
</script>
