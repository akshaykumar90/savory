<template>
  <ErrorScreen v-if="isError" :detail="errorDetail">
    <PrimaryButton
      :button-text="isFetching ? 'Retrying' : 'Retry'"
      :is-disabled="isFetching"
      @click="onRetry"
    >
      <ArrowPathIcon class="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
    </PrimaryButton>
  </ErrorScreen>
  <div v-else-if="data" class="flex flex-col">
    <pagination-card></pagination-card>
    <drill-down-card v-if="showDrillDownCard"></drill-down-card>
    <ul role="list" class="flex flex-col">
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
import ErrorScreen from '../components/ErrorScreen.vue'
import PrimaryButton from '../components/PrimaryButton.vue'

import useBookmarksPage from '../composables/useBookmarksPage'
import { computed, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate, useRoute } from 'vue-router'
import { usePageStore } from '../stores/page'
import { useQueryClient, useIsMutating } from '@tanstack/vue-query'
import { prefetchTags } from '../composables/useTags'
import { windowTitle } from '../lib/title'
import { ArrowPathIcon } from '@heroicons/vue/20/solid'

export default {
  components: {
    ErrorScreen,
    BookmarkRow,
    PrimaryButton,
    ArrowPathIcon,
    PaginationCard,
    DrillDownCard,
  },
  setup() {
    const { isFetching, isError, error, refetch, data } = useBookmarksPage()

    const route = useRoute()

    const store = usePageStore()
    const queryClient = useQueryClient()
    const isMutating = useIsMutating()

    // We prefetch tags here to avoid the first-time delay while interacting
    // with the edit tags dialog. In contrast with `useQuery`, this call does
    // not create a subscription. This is desired because otherwise we will be
    // needlessly firing the get tags request on window refocus, etc.
    prefetchTags()

    const showDrillDownCard = computed(() => {
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

    document.title = windowTitle(store)

    store.$subscribe((_, state) => {
      document.title = windowTitle(state)
    })

    const errorDetail = computed(() => {
      if (error.value) {
        return `${error.value.toString()}. Please try again.`
      }
    })

    return {
      data,
      isFetching,
      isError,
      errorDetail,
      onRetry: refetch,
      showDrillDownCard,
    }
  },
  beforeRouteEnter: function (to) {
    const store = usePageStore()
    store.onRouteEnter(to.query)
  },
}
</script>
