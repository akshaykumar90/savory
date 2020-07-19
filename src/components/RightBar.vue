<template>
  <div>
    <p class="text-muted text-sm">Tags</p>
    <ul class="text-muted text-xs mt-4">
      <li class="mb-2" v-for="[name, count] in tags" :key="name">
        <button
          @click="tagClicked(name)"
          class="hover:underline focus:outline-none"
        >
          {{ name }}
        </button>
        ({{ count }})
      </li>
    </ul>
  </div>
</template>

<script>
import _ from 'lodash'

export default {
  name: 'right-bar',

  computed: {
    tags() {
      const unsortedTags = this.$store.getters.tagsCount
      return _.sortBy(unsortedTags, ['0'])
    },
  },

  methods: {
    tagClicked(name) {
      this.$store.dispatch('FILTER_ADDED', { type: 'tag', name })
    },
  },
}
</script>
