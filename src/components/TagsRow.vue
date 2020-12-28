<template>
  <div
    class="flex flex-wrap items-end py-1"
    @click.stop="collapseSiblings"
    v-bind:class="[editMode ? 'border-0 bg-grey-100 rounded -ml-1 pl-1' : '']"
  >
    <button
      class="text-primary h-6 px-1 my-1 mr-2 text-center text-xs rounded border border-primary select-none focus:outline-none"
      v-bind:class="[editMode ? 'bg-default' : 'bg-grey-100']"
      v-if="bookmarkSite"
      @click="tagClicked({ tagType: 'site' })"
    >
      {{ bookmarkSite }}
      <a v-if="filterMode && !editMode" class="tag-link add"></a>
    </button>
    <button
      v-for="(tag, index) in bookmarkTags"
      :key="index"
      class="text-primary h-6 px-1 my-1 mr-2 text-center text-xs rounded border border-primary select-none focus:outline-none"
      v-bind:class="[editMode ? 'bg-default' : 'bg-grey-100']"
      @click="tagClicked({ tagType: 'tag', tagName: tag })"
    >
      {{ tag }}
      <a
        v-if="editMode || filterMode"
        class="tag-link"
        v-bind:class="[editMode ? 'remove' : 'add']"
      ></a>
    </button>
    <div class="relative" v-bind:class="{ 'flex-grow': editMode }">
      <input
        type="text"
        tabindex="-1"
        :placeholder="placeholder"
        class="block placeholder-default px-0.5 text-xs bg-grey-100 border-0 focus:outline-none focus:ring-0 rounded my-1 py-2 h-6 w-full"
      />
      <input
        ref="input"
        type="text"
        title="Click to add or remove tags"
        v-model="newTag"
        @keydown.tab.prevent="onTab"
        @keyup.enter="onEnter"
        @focus="enterEditMode"
        class="bg-transparent block px-0.5 absolute top-0 left-0 text-default text-xs border-0 focus:outline-none focus:ring-0 rounded my-1 py-2 h-6 w-full"
      />
    </div>
  </div>
</template>

<script>
const typeaheadActivationThreshold = 3
const caseSensitiveTags = false

export const SENTINEL_BULK_EDIT_BOOKMARK_ID = 'WHY NOT ZOIDBERG?'

export default {
  name: 'tags-row',

  props: {
    bookmarkId: String,
  },

  data: function () {
    return {
      bookmarkSite:
        this.bookmarkId === SENTINEL_BULK_EDIT_BOOKMARK_ID
          ? null
          : this.$store.getters.getBookmarkById(this.bookmarkId).site,
      editMode: this.bookmarkId === SENTINEL_BULK_EDIT_BOOKMARK_ID, // Bulk edit component starts (and remains) in editMode
      newTag: '',
      tagSuggestion: '',
    }
  },

  methods: {
    tagClicked({ tagType, tagName }) {
      if (this.editMode) {
        this.removeTag(tagName)
        // We can only delete a tag when we put focus on the input box. When
        // we delete a tag, the input box should not lose focus.
        this.$refs.input.focus()
        return
      }
      let dataObj = { type: tagType, drillDown: this.filterMode }
      if (tagType === 'site') {
        this.$store.dispatch('FILTER_ADDED', {
          ...dataObj,
          name: this.bookmarkSite,
        })
      } else if (tagType === 'tag') {
        this.$store.dispatch('FILTER_ADDED', { ...dataObj, name: tagName })
      }
    },
    onTab() {
      const tagToAdd = this.tagSuggestion.length
        ? this.tagSuggestion
        : this.newTag
      this.addNewTag(tagToAdd)
    },
    onEnter() {
      const tagToAdd = this.newTag
      this.addNewTag(tagToAdd)
    },
    addNewTag(tagToAdd) {
      if (!tagToAdd.trim()) {
        return
      }

      let tag = tagToAdd.trim().replace(/\s+/g, ' ')
      if (this.bookmarkId === SENTINEL_BULK_EDIT_BOOKMARK_ID) {
        this.$store.dispatch('ADD_TAG_TO_SELECTED', { tag })
      } else {
        let dataObj = { id: this.bookmarkId, tag }
        this.$store.dispatch('ADD_TAG_FOR_BOOKMARK', dataObj)
      }

      this.newTag = ''
    },
    removeTag(tagName) {
      if (!tagName) {
        return
      }
      if (this.bookmarkId === SENTINEL_BULK_EDIT_BOOKMARK_ID) {
        this.$store.dispatch('REMOVE_TAG_FROM_SELECTED', { tag: tagName })
      } else {
        let dataObj = { id: this.bookmarkId, tag: tagName }
        this.$store.dispatch('REMOVE_TAG_FROM_BOOKMARK', dataObj)
      }
    },
    doSearch(searchQuery) {
      let searchResults = []

      const allTags = this.$store.getters.tagNames
      for (let tag of allTags) {
        const compareable = caseSensitiveTags ? tag : tag.toLowerCase()
        if (
          compareable.startsWith(searchQuery) &&
          !this.bookmarkTags.includes(compareable)
        ) {
          searchResults.push(tag)
        }
      }

      // Sort the search results by length
      searchResults.sort((a, b) => {
        return a.length - b.length
      })

      return searchResults
    },

    enterEditMode() {
      this.editMode = true
      Event.$on('exitEditMode', this.exitEditMode)
    },
    exitEditMode({ currFocusId }) {
      if (this.bookmarkId === SENTINEL_BULK_EDIT_BOOKMARK_ID) {
        // Never exit edit mode
        return
      }
      if (this.bookmarkId !== currFocusId) {
        this.editMode = false
        this.newTag = ''
        Event.$off('exitEditMode', this.exitEditMode)
      }
    },
    collapseSiblings() {
      Event.$emit('exitEditMode', { currFocusId: this.bookmarkId })
    },
  },

  computed: {
    bookmarkTags() {
      if (this.bookmarkId === SENTINEL_BULK_EDIT_BOOKMARK_ID) {
        return this.$store.getters.tagsInBulkEdit
      }
      return this.$store.getters.getBookmarkById(this.bookmarkId).tags
    },
    filterMode() {
      return this.$store.state.list.activeType !== 'new'
    },
    placeholder() {
      if (
        !this.newTag.length ||
        this.newTag.length < typeaheadActivationThreshold
      ) {
        this.tagSuggestion = ''
        return ''
      }
      const searchQuery = caseSensitiveTags
        ? this.newTag
        : this.newTag.toLowerCase()
      const results = this.doSearch(searchQuery)
      if (!results.length) {
        this.tagSuggestion = ''
        return ''
      }
      this.tagSuggestion = results[0]
      let suggestion = results[0].split('')
      let userInput = this.newTag.split('')
      userInput.forEach((letter, key) => {
        if (letter !== suggestion[key]) {
          suggestion[key] = letter
        }
      })
      return suggestion.join('')
    },
  },
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

.tag-link:before,
.tag-link:after {
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
