<template>
  <button
    class="inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium"
    :class="buttonColors"
    @click="onClick(name)"
  >
    {{ name }}
    <span
      class="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md focus:outline-none"
      :class="crossIconColors"
      v-if="showRemove"
    >
      <span class="sr-only">Remove tag</span>
      <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
      </svg>
    </span>
  </button>
</template>

<script>
import { ref } from 'vue'

export default {
  props: {
    name: String,
    accented: Boolean,
    showRemove: Boolean,
    onClick: Function,
  },
  setup(props) {
    const baseColor = props.accented ? 'yellow' : 'indigo'
    const buttonColors = ref([`bg-${baseColor}-100`, `text-${baseColor}-800`])
    const crossIconColors = ref([
      `text-${baseColor}-400`,
      `hover:bg-${baseColor}-200`,
      `hover:text-${baseColor}-500`,
      `focus:bg-${baseColor}-500`,
      'focus:text-white',
    ])
    return {
      buttonColors,
      crossIconColors,
    }
  },
}
</script>
