<template>
  <div class="w-full h-screen bg-blue-700 bg-cover">
    <nav class="w-full bg-gray-100">
      <div class="mx-24 flex justify-between items-center">
        <a href="#">
          <img class="h-16" src="../assets/logo_light.svg" alt="logo">
        </a>
        <div>
          <a href="#" class="hover:underline" @click="login">Sign In</a>
        </div>
      </div>
    </nav>
    <main class="mx-64 pt-24 flex flex-col items-end">
      <div class="max-w-xs">
        <h2 class="text-5xl leading-none tracking-tight font-semibold text-gray-300">Start Organizing</h2>
        <div class="mt-6 select-none">
          <a href="#" @click="login" class="block w-full rounded-lg px-6 py-4 text-lg leading-6 bg-indigo-900 text-gray-300 text-center">Create an Account</a>
        </div>
        <p class="text-sm leading-5 mt-4 font-medium text-gray-200">Already have an account? <a href="#" @click="login"class="underline">Sign In</a></p>
      </div>
    </main>
  </div>
</template>

<script>
  export default {
    name: 'landing-page',

    methods: {
      async login () {
        await this.$auth.loginWithPopup()
        if (this.$auth.isAuthenticated) {
          this.$router.push({
            name: 'app'
          })
        }
      }
    }
  }
</script>
