<template>
  <nav
    class="bg-white py-3 flex flex-row-reverse gap-4 items-center"
    aria-label="Pagination"
  >
    <div class="flex justify-between sm:justify-end">
      <a
        href="#"
        class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Previous
      </a>
      <a
        href="#"
        class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
      >
        Next
      </a>
    </div>
    <div>
      <p class="text-sm text-gray-700">
        <span class="font-medium">{{ start }}</span>
        {{ ' - ' }}
        <span class="font-medium">{{ end }}</span>
        {{ ' ' }}
        of
        {{ ' ' }}
        <span class="font-medium">{{ total }}</span>
      </p>
    </div>
  </nav>
</template>

<script setup>
const start = 1
const end = 100
const total = 779
</script>
