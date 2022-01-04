<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="tag in tags" :key="tag" class="py-4 flex">
      <div class="w-full mx-4 flex flex-row justify-between">
        <span class="text-gray-900">{{ tag }}</span>
        <span class="text-gray-900">20</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
const tags = [
  'web.dev',
  'frontend',
  'books',
  'performance',
  'nextjs',
  'performance',
  'web.dev',
  'frontend',
  'angularjs',
  'web.dev',
  'frontend',
  'books',
  'performance',
  'nextjs',
  'performance',
  'web.dev',
  'frontend',
  'angularjs',
  'web.dev',
  'frontend',
  'books',
  'performance',
  'nextjs',
  'performance',
  'web.dev',
  'frontend',
  'angularjs',
]
</script>
