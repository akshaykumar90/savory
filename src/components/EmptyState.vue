<template>
  <div class="py-16 px-4 text-center sm:px-6 lg:px-8">
    <img
      class="mx-auto w-3/4 opacity-75 sm:w-1/2"
      src="../assets/images/reflecting.png"
      alt=""
      width="400"
      height="326"
    />
    <h3 class="mt-10 text-sm font-medium text-gray-900">{{ title }}</h3>
    <p class="mt-1 text-sm text-gray-500">
      <slot></slot>
    </p>
  </div>
</template>

<script setup>
const props = defineProps({
  title: String,
})
</script>
