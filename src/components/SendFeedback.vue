<template>
  <a
    class="relative inline-block select-none appearance-none rounded-md border border-green-900 border-opacity-20 bg-green-600 py-1.5 px-4 text-center align-middle text-sm font-medium text-white no-underline shadow-md hover:bg-green-700"
    :href="url"
    target="_blank"
    >Bugs & Feedback</a
  >
</template>

<script>
export default {
  name: 'SendFeedback',

  data: function () {
    return {
      url: 'https://getsavory.co/feedback',
    }
  },
}
</script>
