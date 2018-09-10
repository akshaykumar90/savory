<template>
  <li><a :href="bookmark.site" target="_blank" rel="noopener">{{ bookmark.title }}</a> • {{ domainName }}</li>
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