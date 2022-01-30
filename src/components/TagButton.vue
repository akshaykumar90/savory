<template>
  <span
    class="inline-flex items-center rounded-md bg-indigo-100 px-2.5 py-0.5 text-sm font-medium text-indigo-800"
  >
    {{ name }}
    <button
      type="button"
      class="ml-1 inline-flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-md text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:bg-indigo-500 focus:text-white focus:outline-none"
      @click="onRemove(name)"
    >
      <span class="sr-only">Remove tag</span>
      <svg class="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
        <path stroke-linecap="round" stroke-width="1.5" d="M1 1l6 6m0-6L1 7" />
      </svg>
    </button>
  </span>
</template>

<script>
export default {
  name: 'tag-button',
  props: {
    name: String,
    onRemove: Function,
  },
}
</script>
