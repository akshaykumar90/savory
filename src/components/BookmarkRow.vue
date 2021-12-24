<template>
  <h3>{{ b.title }}</h3>
  <span class="text-blue-500">4 days ago</span>
  <div class="flex">
    <a v-for="(tag, index) in b.tags" :key="index">
      {{ tag }}
    </a>
    <a href="#">+</a>
  </div>
</template>

<script>
const item = {
  date_added: 1639901969084,
  id: 'kr9kAMLx',
  tags: ['web.dev', 'frontend', 'books', 'performance', 'nextjs'],
  title:
    'How QuintoAndar increased conversion rates and pages per session by improving page performance',
  url: 'https://web.dev/quintoandar/',
}

export default {
  name: 'bookmark-row',
  setup() {
    return {
      b: item,
    }
  },
}
</script>
