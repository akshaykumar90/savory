<template>
  <div class="flex flex-wrap items-end pt-2">
    <span v-for="(tag, index) in tags" :key="index"
          class="bg-grey-lighter text-teal-dark p-1 mr-2 text-center text-xs rounded cursor-pointer border border-teal-dark">
      <span>{{ tag }}</span>
    </span>
    <input type="text" title="new-tag"
           v-model="newTag" @keydown.tab.prevent="addNewTag" @keyup.enter="addNewTag"
           class="block text-teal-darker font-xs bg-grey-lighter focus:bg-grey-light focus:outline-none rounded px-2 py-2 h-6">
  </div>
</template>

<script>
  export default {
    name: 'tags-row',

    props: {
      bookmarkId: String
    },

    data: function () {
      return {
        newTag: ''
      }
    },

    methods: {
      addNewTag () {
        if (!this.newTag.trim()) {
          return;
        }

        this.$store.dispatch({
          type: 'ADD_TAG_FOR_BOOKMARK',
          id: this.bookmarkId,
          tag: this.newTag.trim()
        })

        this.newTag = ''
      }
    },

    computed: {
      bookmark () {
        return this.$store.getters.getBookmarkById(this.bookmarkId)
      },
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
