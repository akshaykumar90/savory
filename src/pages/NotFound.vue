<template>
  <div>
    <header
      class="sticky top-0 z-50 flex items-center justify-center bg-gray-100 bg-opacity-90 px-4 py-4 md:justify-between md:px-16"
    >
      <div>
        <router-link to="/">
          <img class="w-24" src="../assets/logo_light.svg" alt="logo" />
        </router-link>
      </div>
    </header>
    <section class="mx-auto max-w-3xl px-4">
      <div class="flex flex-col items-center py-8 text-center">
        <h3 class="mt-12 mb-8 text-3xl text-gray-800">Page Not Found</h3>
        <p class="mb-4 w-3/4 text-xl text-gray-700">
          We could not find what you were looking for.
        </p>
        <router-link to="/">
          <button
            class="mt-4 select-none rounded bg-primary py-2 px-4 text-lg tracking-wide text-white hover:bg-blue-700 focus:outline-none"
          >
            Go back home
          </button>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script>
export default {
  name: 'not-found',
}
</script>
