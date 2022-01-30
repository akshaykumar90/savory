<template>
  <ul role="list" class="divide-y divide-gray-200">
    <li v-for="tag in tags" :key="tag" class="flex py-4">
      <div class="mx-4 flex w-full flex-row justify-between">
        <span class="text-gray-900 line-clamp-1">{{ tag }}</span>
        <span class="text-gray-900">20</span>
      </div>
    </li>
  </ul>
</template>

<script setup>
const tags = [
  'web.dev',
  'frontend',
  'performance performance performance performance',
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
  'nextjs',
  'performance',
  'web.dev',
  'frontend',
  'angularjs',
]
</script>
