<template>
  <a
    class="
      relative
      appearance-none
      inline-block
      select-none
      no-underline
      bg-green-600
      hover:bg-green-700
      text-white text-sm
      font-medium
      text-center
      align-middle
      py-1.5
      px-4
      rounded-md
      shadow-md
      border border-opacity-20 border-green-900
    "
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
