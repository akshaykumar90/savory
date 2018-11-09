<template>
  <li class="mb-2">
    <a :href="bookmark.site" target="_blank" rel="noopener" class="no-underline hover:underline">{{ bookmark.title }}</a>
    <TagsRow :value="tags"></TagsRow>
  </li>
</template>

<script>
  import TagsRow from './TagsRow.vue'

  export default {
    name: 'bookmark-row',

    components: {
      TagsRow
    },

    props: {
      bookmark: Object
    },

    computed: {
      domainName () {
        const url = new URL(this.bookmark.site);
        // Drop the subdomain, e.g. news.ycombinator.com -> ycombinator.com
        return url.hostname.split('.').splice(-2, 2).join('.')
      },
      tags () {
        return [this.domainName, ...this.bookmark.tags]
      }
    }
  }
</script>
