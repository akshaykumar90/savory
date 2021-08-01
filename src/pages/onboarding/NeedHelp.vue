<template>
  <div class="flex flex-col items-center">
    <h3 class="font-bold text-2xl lg:text-3xl mt-12 mb-8 text-gray-800">
      Need help?
    </h3>
    <p class="text-lg lg:text-xl text-gray-700 mb-4 lg:w-3/4">
      If you have a question or want to submit any feedback, the send feedback
      button in the app will come in handy.
    </p>
    <router-link
      to="/welcome/5"
      tag="button"
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
    >
      Next →
    </router-link>
    <p class="text-xs leading-5 mt-4 text-gray-700">
      <router-link to="/" tag="button" class="underline">
        Skip Tour
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  name: 'onboarding-need-help',
}
</script>
