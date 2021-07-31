<template>
  <div class="flex flex-col items-center text-center py-8">
    <h3 class="text-3xl mt-12 mb-8 text-gray-800">Need help?</h3>
    <p class="text-xl text-gray-700 mb-4 w-3/4">
      If you have a question or want to submit any feedback, the send feedback
      button in the app will come in handy.
    </p>
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
  name: 'onboarding-need-help',
}
</script>
