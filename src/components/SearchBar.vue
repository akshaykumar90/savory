<template>
  <div>
    <input ref="input" type="text" placeholder="Search bookmarks" autocomplete="off" spellcheck="false"
           v-model="query" @keyup="doSearch"
           class="focus:outline-none text-sm text-muted border border-transparent focus:bg-default focus:border-primary rounded bg-grey-100 py-2 pr-4 pl-10 block w-full appearance-none leading-normal">
    <div class="absolute pin-y pin-l pl-3 flex items-center" v-if="query">
      <svg class="fill-current text-muted w-5 h-5 cursor-pointer" @click="clearSearch" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
        <path d="M50,14c-19.9,0-36,16.1-36,36s16.1,36,36,36s36-16.1,36-36S69.9,14,50,14z M62.4,59.6c0.8,0.8,0.8,2,0,2.8   C62,62.8,61.5,63,61,63s-1-0.2-1.4-0.6L50,52.8l-9.6,9.6C40,62.8,39.5,63,39,63s-1-0.2-1.4-0.6c-0.8-0.8-0.8-2,0-2.8l9.6-9.6   l-9.6-9.6c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2-0.8,2.8,0l9.6,9.6l9.6-9.6c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8L52.8,50L62.4,59.6z"></path>
      </svg>
    </div>
    <div class="absolute pin-y pin-l pl-3 flex items-center" v-else>
      <svg class="fill-current pointer-events-none text-muted w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"></path>
      </svg>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'search-bar',

    data: function () {
      return {
        query: ''
      }
    },

    methods: {
      doSearch: _.debounce(function () {
        let query = this.query.trim()
        if (query === '') {
          this.$router.push('/')
        } else {
          this.$router.push(`/q/${query}`)
        }
      }, 300),
      clearSearch: function () {
        this.query = ''
        this.$router.push('/')
      },
      // Used to focus the input from the parent
      focus: function () {
        this.$refs.input.focus()
      }
    },

    watch: {
      '$route' ({ name }) {
        if (name !== 'search') {
          // Clear search bar when we browse away from search results
          this.query = ''
        }
      }
    },
  }
</script>