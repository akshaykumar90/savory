<template>
  <nav class="py-4">
    <p class="text-xs text-muted">{{ pluralized }}</p>
    <p class="text-2xl text-muted font-bold mt-2">{{ numBookmarks.toLocaleString('en') }}</p>
    <div v-if="numSelected" class="flex items-end mt-4">
      <svg class="h-5 w-5 stroke-current text-red-700 cursor-pointer" @click="deleteSelected" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 7L18.1327 19.1425C18.0579 20.1891 17.187 21 16.1378 21H7.86224C6.81296 21 5.94208 20.1891 5.86732 19.1425L5 7M10 11V17M14 11V17M15 7V4C15 3.44772 14.5523 3 14 3H10C9.44772 3 9 3.44772 9 4V7M4 7H20" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      <span class="ml-1 text-sm text-muted">Delete {{ numSelected }}</span>
    </div>
  </nav>
</template>

<script>
  export default {
    name: 'side-bar',

    computed: {
      numBookmarks () {
        return this.$store.getters.numBookmarks
      },
      pluralized () {
        return this.numBookmarks === 1 ? 'Bookmark' : 'Bookmarks'
      },
      numSelected () {
        return this.$store.state.lists['selected'].length
      },
    },

    methods: {
      deleteSelected () {
        this.$store.dispatch('BULK_DELETE_BOOKMARKS')
      }
    },
  }
</script>
