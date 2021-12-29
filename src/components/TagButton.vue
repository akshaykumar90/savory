<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-indigo-100 text-indigo-800"
  >
    <slot></slot>
    <button
      type="button"
      class="flex-shrink-0 ml-1 h-4 w-4 rounded-md inline-flex items-center justify-center text-indigo-400 hover:bg-indigo-200 hover:text-indigo-500 focus:outline-none focus:bg-indigo-500 focus:text-white"
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
}
</script>
