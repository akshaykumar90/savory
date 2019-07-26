<template>
  <div class="flex flex-wrap items-end py-1 mt-2" @click.stop="collapseSiblings"
       v-bind:class="[editMode ? 'border-0 bg-grey-100 rounded -ml-1 pl-1': '']">
    <button class="text-primary p-1 my-1 mr-2 text-center text-xs rounded border border-primary select-none focus:outline-none"
            v-bind:class="[editMode ? 'bg-default' : 'bg-grey-100']"
            @click="tagClicked({tagType: 'site'})">
      {{ bookmark.site }}
      <a v-if="filterMode && !editMode" class="tag-link add"></a>
    </button>
    <button v-for="(tag, index) in bookmark.tags" :key="index"
            class="text-primary p-1 my-1 mr-2 text-center text-xs rounded border border-primary select-none focus:outline-none"
            v-bind:class="[editMode ? 'bg-default' : 'bg-grey-100']"
            @click="tagClicked({tagType: 'tag', tagName: tag})">
      {{ tag }}
      <a v-if="editMode || filterMode" class="tag-link"
         v-bind:class="[editMode ? 'remove': 'add']"></a>
    </button>
    <input type="text" title="new-tag"
           v-model="newTag" @keydown.tab.prevent="addNewTag" @keyup.enter="addNewTag"
           v-bind:class="{'flex-grow': editMode}"
           @focus="enterEditMode"
           class="block text-default text-xs bg-grey-100 border border-transparent focus:outline-none rounded my-1 py-2 h-6">
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
        editMode: false,
        newTag: ''
      }
    },

    methods: {
      tagClicked ({ tagType, tagName }) {
        if (this.editMode) {
          this.removeTag(tagName)
          return
        }
        let dataObj = { type: tagType, drillDown: this.filterMode }
        if (tagType === 'site') {
          this.$store.dispatch('FILTER_ADDED', { ...dataObj, name: this.bookmark.site })
        } else if (tagType === 'tag') {
          this.$store.dispatch('FILTER_ADDED', { ...dataObj, name: tagName })
        }
      },
      addNewTag () {
        if (!this.newTag.trim()) {
          return
        }

        let tag = this.newTag.trim().replace(/\s+/g, ' ')
        let dataObj = { id: this.bookmarkId, tags: [tag] }
        // Sync commit to refresh UI
        this.$store.commit('ADD_TAG', dataObj)
        // Async flush to DB
        this.$store.dispatch('ADD_TAG_FOR_BOOKMARK', dataObj)

        this.newTag = ''
      },
      removeTag (tagName) {
        if (!tagName) {
          return
        }
        let dataObj = { id: this.bookmarkId, tag: tagName }
        // Sync commit to refresh UI
        this.$store.commit('REMOVE_TAG', dataObj)
        // Async flush to DB
        this.$store.dispatch('REMOVE_TAG_FROM_BOOKMARK', dataObj)
      },
      enterEditMode () {
        this.editMode = true
        Event.$on('exitEditMode', this.exitEditMode)
      },
      exitEditMode ({ currFocusId }) {
        if (this.bookmarkId !== currFocusId) {
          this.editMode = false
          this.newTag = ''
          Event.$off('exitEditMode', this.exitEditMode)
        }
      },
      collapseSiblings () {
        Event.$emit('exitEditMode', { currFocusId: this.bookmarkId })
      }
    },

    computed: {
      bookmark () {
        return this.$store.getters.getBookmarkById(this.bookmarkId)
      },
      filterMode () {
        return !!this.$store.state.filter.active.length
      }
    }
  }
</script>

<style scoped>
  .tag-link {
    cursor: pointer;
    position: relative;
    display: inline-block;
    width: 0.5rem;
    height: 0.5rem;
    overflow: hidden;
    margin-left: 0.25rem;
  }

  .tag-link:before, .tag-link:after {
    content: '';
    position: absolute;
    width: 100%;
    top: 50%;
    left: 0;
    background: var(--color-primary);
    height: 2px;
    margin-top: -1px;
  }

  .remove:before {
    transform: rotate(45deg);
  }
  .remove:after {
    transform: rotate(-45deg);
  }

  .add:before {
    transform: rotate(90deg);
  }
  .add:after {
    transform: rotate(0deg);
  }
</style>
