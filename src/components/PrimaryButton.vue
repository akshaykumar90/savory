<template>
  <button
    :type="isSubmitButton ? 'submit' : 'button'"
    :disabled="isDisabled"
    class="inline-flex justify-center rounded-md border border-transparent bg-primary py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-grey-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
  >
    <!-- Optional icon -->
    <slot></slot>
    {{ buttonText }}
  </button>
</template>

<script>
export default {
  props: {
    buttonText: String,
    isDisabled: Boolean,
    isSubmitButton: Boolean,
  },
}
</script>
