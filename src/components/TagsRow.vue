<template>
  <div class="flex flex-wrap items-end pt-2">
    <TagButton>
      <router-link :to="'/site/'+bookmark.site" tag="span">{{ bookmark.site }}</router-link>
    </TagButton>
    <TagButton v-for="(tag, index) in bookmark.tags" :key="index">
      <router-link :to="'/tag/'+tag" tag="span">{{ tag }}</router-link>
    </TagButton>
    <input type="text" title="new-tag"
           v-model="newTag" @keydown.tab.prevent="addNewTag" @keyup.enter="addNewTag"
           class="block text-teal-darker text-xs bg-grey-lighter focus:bg-grey-light focus:outline-none rounded px-2 py-2 h-6">
  </div>
</template>

<script>
  import TagButton from './TagButton.vue'

  export default {
    name: 'tags-row',

    components: {
      TagButton
    },

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
      }
    }
  }
</script>
