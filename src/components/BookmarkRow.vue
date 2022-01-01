<template>
  <li class="flex items-start py-4 gap-2" @click="">
    <MenuAlt2Icon
      class="flex-none h-5 w-5 mt-0.5 mx-4 text-gray-400"
      aria-hidden="true"
    />
    <div>
      <h3>{{ b.title }}</h3>
      <div class="mt-2 flex flex-row flex-wrap gap-1.5">
        <a v-for="(tag, index) in b.tags" :key="index">
          {{ tag }}
        </a>
        <tags-button></tags-button>
      </div>
      <span class="inline-block mt-2">4 days ago</span>
    </div>
  </li>
</template>

<script setup>
import TagsButton from './InlineTagsButton.vue'
import { MenuAlt2Icon } from '@heroicons/vue/solid'

const b = {
  date_added: 1639901969084,
  id: 'kr9kAMLx',
  tags: ['web.dev', 'frontend', 'books', 'performance', 'nextjs'],
  title:
    'How QuintoAndar increased conversion rates and pages per session by improving page performance',
  url: 'https://web.dev/quintoandar/',
}
</script>
