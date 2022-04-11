<template>
  <div class="divide-y divide-gray-200">
    <div class="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
      <span v-if="tags.length === 0">No tags</span>
      <tag-button v-else v-for="tag in tags" :name="tag" :onRemove="onRemove">
      </tag-button>
    </div>
    <div class="px-4 py-5 sm:p-6">
      <div class="flex">
        <label for="add-tag" class="sr-only">Add tag</label>
        <input
          type="text"
          v-model="newTag"
          name="add-tag"
          id="add-tag"
          class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Add a tag"
          @keyup.enter="onEnter"
          ref="addTagInput"
        />
      </div>
    </div>
  </div>
</template>

<script>
import TagButton from './TagButton.vue'
import { ref } from 'vue'
import useBulkEditBookmarks from '../composables/useBulkEditBookmarks'
import useEditBookmark from '../composables/useEditBookmark'

export default {
  components: {
    TagButton,
  },
  props: {
    bookmarkId: String,
    bulk: Boolean,
  },
  mounted() {
    this.$refs.addTagInput.focus()
  },
  setup(props) {
    const newTag = ref('')
    const addTagInput = ref(null)
    const { tags, addTag, removeTag } = props.bulk
      ? useBulkEditBookmarks()
      : props.bookmarkId
      ? useEditBookmark(props.bookmarkId)
      : { tags: ref(null), addTag: () => {}, removeTag: () => {} }
    const onEnter = () => {
      addTag(newTag.value)
      newTag.value = ''
    }
    return {
      newTag,
      addTagInput,
      tags,
      onEnter,
      onRemove: removeTag,
    }
  },
}
</script>
