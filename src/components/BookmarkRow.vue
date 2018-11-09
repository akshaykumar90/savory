<template>
  <li class="mb-2">
    <a :href="bookmark.site" target="_blank" rel="noopener" class="no-underline hover:underline">{{ bookmark.title }}</a>
    <ul class="list-reset">
      <li>{{ domainName }}</li>
      <li v-for="tag in tags" :key="tag.id">
        {{ tag.name }}
      </li>
    </ul>
  </li>
</template>

<script>

export default {
  name: 'bookmark-row',
  props: {
    bookmark: Object
  },
  computed: {
    domainName () {
      const url = new URL(this.bookmark.site);
      return url.hostname
    },
    tags () {
      return this.bookmark.tags
    }
  }
}
</script>
