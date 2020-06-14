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
import { mongoApp } from '../api/mongodb'
import { store } from '../store'

const { auth } = mongoApp

export default {
  name: 'landing-page',

  methods: {
    async login(initialScreen) {
      await this.$auth.loginWithPopup(initialScreen)
      if (this.$auth.isAuthenticated) {
        /**
         * On launch, we speculatively start fetching bookmarks from the
         * database before having a valid auth token from Auth0. It works
         * because MongoDB auth tokens (used for fetching bookmarks) are
         * separate from Auth0-issued tokens.
         *
         * It is a useful "hack" because it greatly speeds up our
         * time-to-interactive. We are effectively able to parallelize the two
         * network operations. And it works most of the times since both the
         * tokens are valid anyway.
         *
         * Until they are not. Auth0 has a stricter upper limit for the
         * validity of its token such that after some time, the user _has_ to
         * log in manually.
         *
         * > the unfortunate side-effect of that is that refresh tokens are not
         * > really suitable for browser-based applications.
         * >
         * > https://community.auth0.com/t/renewauth-silent-auth-session-expiration/6929/2
         *
         * Long story short, we might have dirty state by the time we realize
         * that Auth0 has logged us out. We must start from a clean slate
         * before proceeding to the app.
         */
        store.commit('CLEAR_STATE')
        this.$router.push({
          name: 'welcome',
        })
      }
    },
  },

  created() {
    if (auth.isLoggedIn) {
      // MongoDB auth tokens have their own lifecycle and may outlast Auth0
      // tokens. We end up on the landing page when Auth0 token expires. We
      // must invalidate mongodb auth token when the user is logged out.
      Event.$emit('logout')
    }
  },
}
</script>
