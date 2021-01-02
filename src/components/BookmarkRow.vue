<template>
  <div class="flex items-start">
    <label class="pr-4 pt-1 hidden md:block">
      <input
        type="checkbox"
        :checked="isChecked"
        class="rounded border-gray-300 text-blue-500 shadow-sm focus:ring focus:ring-blue-200 focus:ring-opacity-50"
        @change="onSelect"
        ref="checkbox"
      />
    </label>
    <div class="px-1 flex-grow space-y-2">
      <a
        :href="bookmark.url"
        target="_blank"
        rel="noopener"
        class="text-sm text-default leading-5"
        >{{ bookmark.title }}
      </a>
      <div class="relative">
        <p
          class="text-xs text-grey-500 leading-3"
          @mouseenter="showTimestampTooltip = true"
          @mouseleave="showTimestampTooltip = false"
        >
          {{ dateAdded.format('ll') }}
        </p>
        <div class="absolute left-0 top-4 z-50" v-if="showTimestampTooltip">
          <Tooltip>
            {{ dateAdded.format('LT [·] ll') }}
          </Tooltip>
        </div>
      </div>
      <div>
        <TagsRow :bookmark-id="bookmarkId"></TagsRow>
      </div>
    </div>
  </div>
</template>

<script>
import TagsRow from './TagsRow.vue'
import Tooltip from './Tooltip.vue'
import moment from 'moment'

export default {
  name: 'bookmark-row',

  components: {
    TagsRow,
    Tooltip,
  },

  props: {
    bookmarkId: String,
  },

  data: function () {
    return {
      dateAdded: moment(
        this.$store.getters.getBookmarkById(this.bookmarkId).dateAdded
      ),
      showTimestampTooltip: false,
    }
  },

  computed: {
    bookmark() {
      return this.$store.getters.getBookmarkById(this.bookmarkId)
    },
    isChecked() {
      return this.$store.getters.getBookmarkById(this.bookmarkId).selected
    },
  },

  methods: {
    onSelect() {
      const actionName = this.$refs.checkbox.checked
        ? 'BOOKMARK_SELECTED'
        : 'BOOKMARK_UNSELECTED'
      this.$store.dispatch({
        type: actionName,
        id: this.bookmarkId,
      })
    },
  },
}
</script>
