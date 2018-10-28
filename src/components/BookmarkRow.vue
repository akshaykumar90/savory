<template>
  <li class="mb-2">
    <a :href="bookmark.site"
       target="_blank" rel="noopener"
       class="no-underline hover:underline">{{ bookmark.title }}</a> • <span class="domain">{{ domainName }}</span>
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
    }
  }
}
</script>
