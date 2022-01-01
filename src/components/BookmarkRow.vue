<template>
  <div class="flex items-start" @click="">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      class="h-12 w-12 -mt-1"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        fill-rule="evenodd"
        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
        clip-rule="evenodd"
      />
    </svg>
    <div class="ml-4">
      <h3>{{ b.title }}</h3>
      <div class="mt-2 flex flex-row flex-wrap gap-1.5">
        <a v-for="(tag, index) in b.tags" :key="index">
          {{ tag }}
        </a>
        <tags-button></tags-button>
      </div>
      <span class="inline-block mt-2">4 days ago</span>
    </div>
  </div>
</template>

<script setup>
import TagsButton from './InlineTagsButton.vue'
const b = {
  date_added: 1639901969084,
  id: 'kr9kAMLx',
  tags: ['web.dev', 'frontend', 'books', 'performance', 'nextjs'],
  title:
    'How QuintoAndar increased conversion rates and pages per session by improving page performance',
  url: 'https://web.dev/quintoandar/',
}
</script>
