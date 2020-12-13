<template>
  <div>
    <header
      class="bg-opacity-90 bg-gray-100 sticky top-0 z-50 px-4 py-4 lg:px-16 flex justify-between items-center"
    >
      <div>
        <router-link to="/">
          <img class="w-24" src="../assets/logo_light.svg" alt="logo" />
        </router-link>
      </div>
    </header>
    <section class="max-w-3xl mx-auto px-4">
      <div class="flex flex-col items-center text-center py-8">
        <h3 class="text-3xl mt-12 mb-8 text-gray-800">
          Page Not Found
        </h3>
        <p class="text-xl text-gray-700 mb-4 w-3/4">
          We could not find what you were looking for.
        </p>
        <router-link to="/">
          <button
            class="mt-4 bg-primary hover:bg-blue-700 text-lg tracking-wide text-white py-2 px-4 rounded select-none focus:outline-none"
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
