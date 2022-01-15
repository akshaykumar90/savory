<template>
  <div class="divide-y divide-gray-200">
    <div class="px-4 py-5 sm:p-6">
      <div class="flex">
        <label for="add-tag" class="sr-only">Add tag</label>
        <input
          type="text"
          v-model="newTag"
          name="add-tag"
          id="add-tag"
          class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Add a tag"
          @keyup.enter="onEnter"
        />
      </div>
    </div>
    <div class="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
      <tag-button v-for="tag in data.tags">
        {{ tag }}
      </tag-button>
    </div>
  </div>
</template>

<script>
import TagButton from './TagButton.vue'
import { useBookmark, useAddTag } from '../composables/useBookmark'
import { ref } from 'vue'

export default {
  components: {
    TagButton,
  },
  props: ['bookmarkId'],
  setup(props) {
    const newTag = ref('')
    const { data } = useBookmark(props.bookmarkId)
    const addTagMutation = useAddTag()
    const onEnter = () =>
      addTagMutation.mutate({
        bookmarkId: props.bookmarkId,
        newTag: newTag.value,
      })
    return {
      newTag,
      onEnter,
      data,
    }
  },
}
</script>
