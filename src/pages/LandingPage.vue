<template>
  <div class="leading-normal">
    <nav class="w-full bg-gray-100 bg-opacity-90 sticky top-0 z-50">
      <div class="mx-24 h-20 flex justify-between items-center">
        <a href="#">
          <img class="h-16" src="../assets/logo_light.svg" alt="logo" />
        </a>
        <div>
          <a href="#" class="text-xs hover:underline" @click="login">Sign In</a>
        </div>
      </div>
    </nav>
    <section class="max-w-3xl mx-auto px-4">
      <div class="flex flex-col items-center text-center py-8">
        <h3 class="text-3xl mt-12 mb-8 text-gray-800">
          Start organizing today
        </h3>
        <p class="text-xl text-gray-700 mb-4 w-3/4">
          Get started for free and re-discover your bookmarks with the power of
          Savory.
        </p>
        <button
          class="mt-4 bg-primary hover:bg-blue-700 text-lg tracking-wide text-white py-2 px-4 rounded select-none focus:outline-none"
          @click="login('signUp')"
        >
          Create an Account
        </button>
        <p class="text-xs leading-5 mt-4 text-gray-700">
          Already have an account?
          <a href="#" @click="login" class="underline">Sign In</a>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'landing-page',

  methods: {
    async login(initialScreen) {
      await this.$auth.loginWithPopup(initialScreen)
      if (this.$auth.isAuthenticated) {
        this.$router.push({
          name: 'welcome',
        })
      }
    },
  },
}
</script>
