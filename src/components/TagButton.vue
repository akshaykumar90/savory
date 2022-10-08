<template>
  <button
    class="inline-flex items-center rounded-md px-2.5 py-0.5 text-sm font-medium"
    :class="buttonColors"
    @click="onClick(name)"
  >
    {{ name }}
    <span
      class="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md focus:text-white focus:outline-none"
      :class="removeIconColors"
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
    const baseColors = ref(['bg-indigo-100', 'text-indigo-800'])
    const accentColors = ref(['bg-pink-100', 'text-pink-800'])
    const baseRemoveIconColors = ref([
      'text-indigo-400',
      'hover:bg-indigo-200',
      'hover:text-indigo-500',
      'focus:bg-indigo-500',
    ])
    const accentRemoveIconColors = ref([
      'text-pink-400',
      'hover:bg-pink-200',
      'hover:text-pink-500',
      'focus:bg-pink-500',
    ])
    return {
      buttonColors: props.accented ? accentColors : baseColors,
      removeIconColors: props.accented
        ? accentRemoveIconColors
        : baseRemoveIconColors,
    }
  },
}
</script>
