<template>
  <div class="divide-y divide-gray-200">
    <div class="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
      <span v-if="tags.length === 0">No tags</span>
      <tag-button
        v-else
        v-for="tag in tags"
        :key="tag.name"
        :name="tag.name"
        :accented="tag.accented"
        :showRemove="true"
        :onClick="onRemove"
      >
      </tag-button>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <div class="relative flex">
        <label for="add-tag" class="sr-only">Add tag</label>
        <input
          type="text"
          tabindex="-1"
          :placeholder="placeholder"
          class="block w-full rounded-md border-gray-300 bg-white shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
        <input
          type="text"
          v-model="newTag"
          autocomplete="nope"
          name="add-tag"
          id="add-tag"
          class="absolute top-0 left-0 block w-full rounded-md border-gray-300 bg-transparent text-default shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          @keyup.enter="onEnter"
          @keydown.tab.stop.prevent="onTab"
          ref="addTagInput"
        />
      </div>
    </div>
  </div>
</template>

<script>
import _ from 'lodash'
import TagButton from './TagButton.vue'
import { computed, ref } from 'vue'
import useBulkEditBookmarks from '../composables/useBulkEditBookmarks'
import useEditBookmark from '../composables/useEditBookmark'
import { lookup } from '../lib/typeahead'
import { useTags } from '../composables/useTags'
import { tagsWithAccentBit } from '../lib/tagsRow'
import { usePageStore } from '../stores/page'

export default {
  components: {
    TagButton,
  },
  props: {
    bookmarkId: String,
    bulk: Boolean,
    popup: Boolean,
  },
  mounted() {
    this.$refs.addTagInput.focus()
  },
  setup(props) {
    const newTag = ref('')

    const tagSuggestion = ref('')
    const { data } = useTags()
    const allTags = computed(() => data.value || [])

    const addTagInput = ref(null)

    const { tags, addTag, removeTag } = props.bulk
      ? useBulkEditBookmarks()
      : props.bookmarkId
      ? useEditBookmark(props.bookmarkId)
      : { tags: ref(null), addTag: () => {}, removeTag: () => {} }
    const typeaheadActivationThreshold = 3
    const displayTags = computed(() => {
      let pageTags = []
      if (!props.popup) {
        const pageStore = usePageStore()
        pageTags = pageStore.tags
      }
      return tagsWithAccentBit(tags.value, pageTags)
    })
    const placeholder = computed(() => {
      if (
        !newTag.value.length ||
        newTag.value.length < typeaheadActivationThreshold
      ) {
        tagSuggestion.value = ''
        return ''
      }
      let candidates = lookup(allTags.value, newTag.value)
      // Remove existing tags from autocomplete candidates
      _.pullAll(candidates, tags.value)
      if (!candidates.length) {
        tagSuggestion.value = ''
        return ''
      }
      tagSuggestion.value = candidates[0]
      let suggestion = candidates[0].split('')
      let userInput = newTag.value.split('')
      userInput.forEach((letter, key) => {
        if (letter !== suggestion[key]) {
          suggestion[key] = letter
        }
      })
      return suggestion.join('')
    })
    function tryAddTag(tagName) {
      if (!tagName.trim()) {
        return
      }

      let cleanedTagName = tagName.trim().replace(/\s+/g, ' ')
      addTag(cleanedTagName)
      newTag.value = ''
    }
    const onEnter = () => tryAddTag(newTag.value)
    const onTab = () => {
      const tagToAdd = tagSuggestion.value.length
        ? tagSuggestion.value
        : newTag.value
      tryAddTag(tagToAdd)
    }
    return {
      newTag,
      addTagInput,
      placeholder,
      tags: displayTags,
      onEnter,
      onTab,
      onRemove: removeTag,
    }
  },
}
</script>
