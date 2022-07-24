<template>
  <div class="flex flex-col">
    <pagination-card></pagination-card>
    <drill-down-card v-if="showDrillDownCard"></drill-down-card>
    <ul role="list" v-if="data" class="flex flex-col">
      <bookmark-row
        v-for="item in data['bookmarks']"
        :key="item['id']"
        :bookmarkId="item['id']"
        :title="item['title']"
        :tags="item['tags']"
        :site="item['site']"
      />
    </ul>
  </div>
</template>

<script>
import BookmarkRow from '../components/BookmarkRow.vue'
import PaginationCard from '../components/PaginationCard.vue'
import DrillDownCard from '../components/DrillDownCard.vue'

import useBookmarksPage from '../composables/useBookmarksPage'
import { computed, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { usePageStore } from '../stores/page'
import { useQueryClient, useIsMutating } from 'vue-query'

export default {
  components: {
    BookmarkRow,
    PaginationCard,
    DrillDownCard,
  },
  setup() {
    const { isLoading, isError, data } = useBookmarksPage()

    const route = useRoute()

    const store = usePageStore()
    const queryClient = useQueryClient()
    const isMutating = useIsMutating()

    const showDrillDownCard = computed(() => {
      if (isLoading.value || isError.value) {
        return false
      }
      return Object.keys(data.value.drillTags).length > 0
    })

    watch(
      () => route.query,
      (routeQuery) => store.onRouteUpdate(routeQuery)
    )

    onBeforeRouteUpdate((to) => store.onBeforeRouteUpdate(to, queryClient))

    onMounted(() => {
      window.addEventListener('beforeunload', (event) => {
        if (isMutating.value > 0) {
          // Cancel the event as stated by the standard.
          event.preventDefault()
          // Older browsers supported custom message
          return (event.returnValue =
            'There is pending work. Sure you want to leave?')
        }
      })
    })

    return {
      data,
      showDrillDownCard,
    }
  },
  beforeRouteEnter: function (to) {
    const store = usePageStore()
    store.onRouteEnter(to.query)
  },
}
</script>
