<template>
  <div class="leading-normal">
    <nav class="w-full bg-gray-100 bg-opacity-90 sticky top-0 z-50">
      <div
        class="md:mx-24 h-20 flex justify-center md:justify-between items-center"
      >
        <a href="#">
          <img class="h-16" src="../assets/logo_light.svg" alt="logo" />
        </a>
        <div class="hidden md:block">
          <a href="#" class="text-xs hover:underline" @click="login('signIn')"
            >Sign In</a
          >
        </div>
      </div>
    </nav>
    <section class="max-w-3xl mx-auto px-4">
      <div class="flex flex-col items-center text-center py-8">
        <h3 class="text-3xl mt-12 mb-8 text-gray-800">
          Start organizing today
        </h3>
        <p class="text-lg md:text-xl text-gray-700 mb-4 w-full md:w-3/4">
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
          <a href="#" @click="login('signIn')" class="underline">Sign In</a>
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import {
  EVENT_SIGNUP_CTA,
  EVENT_LANDING_LOAD,
  eventLogger,
} from '../api/events'

export default {
  name: 'landing-page',

  created() {
    eventLogger.logEvent(EVENT_LANDING_LOAD, { page: 'webapp landing' })
  },

  methods: {
    login(initialScreen) {
      if (initialScreen === 'signUp') {
        eventLogger.logEvent(EVENT_SIGNUP_CTA, { page: 'webapp landing' })
      }
      if (process.env.RUNTIME_CONTEXT === 'webext') {
        this.$auth.loginWithPopup(initialScreen).then(() => {
          this.$router.push({
            name: 'welcome',
          })
        })
      } else {
        this.$auth.loginWithRedirect(initialScreen)
      }
    },
  },
}
</script>
