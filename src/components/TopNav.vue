<template>
  <header
    class="sticky top-0 z-10 shadow"
    v-bind:class="[testMode ? 'bg-yellow-300' : 'bg-grey-300']"
  >
    <div class="w-full md:max-w-7xl mx-auto py-1 md:py-2">
      <div
        class="
          grid
          place-content-center
          md:grid-cols-10
          items-center
          md:gap-x-4
        "
      >
        <div class="md:col-span-2">
          <router-link to="/">
            <img
              class="w-24 md:w-32 md:ml-6"
              src="../assets/logo_light.svg"
              alt="logo"
            />
          </router-link>
        </div>
        <div class="hidden md:block md:col-span-4">
          <SearchBar ref="searchInput"></SearchBar>
        </div>
        <div v-if="isSaving">
          <span class="text-sm text-muted">Saving...</span>
        </div>
        <div class="hidden md:block md:col-start-10">
          <button
            @click="logout"
            class="
              inline-block
              py-2.5
              px-3
              rounded-md
              text-xs text-primary
              bg-default
              border border-primary
              hover:opacity-80
              focus:outline-none
            "
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import SearchBar from './SearchBar.vue'

export default {
  name: 'top-nav',

  components: {
    SearchBar,
  },

  props: {
    testMode: Boolean,
    isSaving: Boolean,
  },

  methods: {
    logout() {
      this.$emit('onLogout')
    },
  },

  mounted() {
    this.$refs.searchInput.focus()
  },
}
</script>
