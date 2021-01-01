<template>
  <div
    role="tooltip"
    class="inline-flex justify-center items-center border rounded border-transparent bg-black bg-opacity-60 leading-none h-5"
  >
    <span class="text-xs leading-3 text-white px-1 text-center">
      <slot></slot>
    </span>
  </div>
</template>

<script>
export default {
  name: 'tooltip',
}
</script>
