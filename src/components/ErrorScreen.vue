<template>
  <div class="py-16 px-4 text-center sm:px-6 lg:px-8">
    <img
      class="mx-auto w-3/4 opacity-75 sm:w-1/2"
      src="../assets/images/meditating.png"
      alt=""
      width="400"
      height="314"
    />
    <h3 class="mt-10 text-sm font-medium text-gray-900">{{ errorTitle }}</h3>
    <p class="mt-1 text-sm text-gray-500">{{ errorDetail }}</p>
    <div class="mt-6">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    detail: String,
  },
  setup(props) {
    const defaultTitle = 'There was an error.'
    const defaultDetail = 'Please try again.'
    const errorTitle = props.title || defaultTitle
    const errorDetail = props.detail || defaultDetail
    return {
      errorTitle,
      errorDetail,
    }
  },
}
</script>
