<template>
  <div class="relative">
    <div
      class="flex flex-wrap items-center py-2 pr-4 pl-10 rounded border"
      v-bind:class="[
        isFocused
          ? 'bg-default border-primary'
          : 'bg-grey-100 border-transparent',
      ]"
    >
      <button
        v-for="(name, index) in filters"
        :key="index"
        @click="removeFilter(index)"
        class="text-primary bg-default px-1 h-6 mr-2 text-center text-xs rounded border border-primary select-none focus:outline-none"
      >
        {{ name }}
        <a class="remove"></a>
      </button>
      <input
        ref="input"
        type="text"
        placeholder="Search bookmarks"
        autocomplete="off"
        spellcheck="false"
        v-model="query"
        @keyup="doSearch"
        @keydown.8="handleBackspace"
        @focus="isFocused = true"
        @blur="isFocused = false"
        class="text-sm text-muted border-0 p-0 h-6 flex-grow bg-grey-100 focus:bg-default focus:outline-none focus:ring-0"
      />
      <span
        v-if="isMacOS && !isFocused"
        class="text-gray-400 text-sm leading-5 py-0.5 px-1.5 border border-gray-300 rounded-md"
      >
        <kbd class="font-sans">⌘</kbd>
        <kbd class="font-sans">K</kbd>
      </span>
    </div>
    <div
      class="absolute inset-y-0 left-0 pl-3 flex items-center"
      v-if="query || filters.length"
    >
      <svg
        class="fill-current text-muted w-5 h-5 cursor-pointer"
        @click="clearSearch"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100 100"
      >
        <path
          d="M50,14c-19.9,0-36,16.1-36,36s16.1,36,36,36s36-16.1,36-36S69.9,14,50,14z M62.4,59.6c0.8,0.8,0.8,2,0,2.8   C62,62.8,61.5,63,61,63s-1-0.2-1.4-0.6L50,52.8l-9.6,9.6C40,62.8,39.5,63,39,63s-1-0.2-1.4-0.6c-0.8-0.8-0.8-2,0-2.8l9.6-9.6   l-9.6-9.6c-0.8-0.8-0.8-2,0-2.8c0.8-0.8,2-0.8,2.8,0l9.6,9.6l9.6-9.6c0.8-0.8,2-0.8,2.8,0c0.8,0.8,0.8,2,0,2.8L52.8,50L62.4,59.6z"
        ></path>
      </svg>
    </div>
    <div class="absolute inset-y-0 left-0 pl-3 flex items-center" v-else>
      <svg
        class="fill-current pointer-events-none text-muted w-4 h-4"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <path
          d="M12.9 14.32a8 8 0 1 1 1.41-1.41l5.35 5.33-1.42 1.42-5.33-5.34zM8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12z"
        ></path>
      </svg>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import { isMacOS } from '../api/browser'

export default {
  name: 'search-bar',

  data: function () {
    return {
      query: '',
      isFocused: false,
      isMacOS: isMacOS(),
    }
  },

  methods: {
    doSearch: _.debounce(function () {
      let query = this.query.trim()
      this.$store.dispatch('SEARCH_QUERY', query)
    }, 300),
    clearSearch: function () {
      this.query = ''
      this.$store.dispatch('CLEAR_SEARCH')
    },
    removeFilter: function (index) {
      this.$store.dispatch('FILTER_REMOVED', index)
    },
    handleBackspace: function () {
      if (!this.query && this.filters.length) {
        this.onBackspaceFilters()
      }
    },
    onBackspaceFilters: _.debounce(function () {
      this.removeFilter(-1)
    }, 150),
    // Used to focus the input from the parent
    focus: function () {
      this.$refs.input.focus()
    },
  },

  computed: {
    filters: function () {
      return this.$store.state.list.filter.active.map(({ name }) => name)
    },
  },

  watch: {
    $route() {
      // Clear search bar when we browse away from search results
      this.query = ''
    },
  },
}
</script>

<style scoped>
.remove {
  cursor: pointer;
  position: relative;
  display: inline-block;
  width: 0.5rem;
  height: 0.5rem;
  overflow: hidden;
  margin-left: 0.25rem;
}

.remove:before,
.remove:after {
  content: '';
  position: absolute;
  width: 100%;
  top: 50%;
  left: 0;
  background: var(--color-primary);
  height: 2px;
  margin-top: -1px;
}

.remove:before {
  transform: rotate(45deg);
}
.remove:after {
  transform: rotate(-45deg);
}
</style>
