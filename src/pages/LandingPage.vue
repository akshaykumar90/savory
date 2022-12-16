<template>
  <div class="leading-normal">
    <nav class="sticky top-0 z-50 w-full bg-gray-100 bg-opacity-90">
      <div
        class="flex h-20 items-center justify-center md:mx-24 md:justify-between"
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
    <section class="mx-auto max-w-3xl px-4">
      <div class="flex flex-col items-center py-8 text-center">
        <h3 class="mt-12 mb-8 text-3xl text-gray-800">
          Start organizing today
        </h3>
        <p class="mb-4 w-full text-lg text-gray-700 md:w-3/4 md:text-xl">
          Get started for free and re-discover your bookmarks with the power of
          Savory.
        </p>
        <button
          class="mt-4 select-none rounded bg-primary py-2 px-4 text-lg tracking-wide text-white hover:bg-blue-700 focus:outline-none"
          @click="login('signup')"
        >
          Create an Account
        </button>
        <p class="mt-4 text-xs leading-5 text-gray-700">
          Already have an account?
          <a href="#" @click="login('signIn')" class="underline">Sign In</a>
        </p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { useAuth } from '../auth'

const { loginWithRedirect } = useAuth()

const login = (initialScreen) => {
  loginWithRedirect(initialScreen)
}
</script>
