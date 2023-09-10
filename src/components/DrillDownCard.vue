<template>
  <div v-if="showCard">
    <nav
      ref="scroller"
      class="mx-3 flex items-center gap-4 overflow-x-auto bg-white py-4"
    >
      <p class="flex-none text-xs uppercase tracking-widest text-slate-600">
        Add to filter
      </p>
      <tag-button
        v-if="showUntagged"
        class="flex-none"
        name="Untagged"
        :accented="true"
        :onClick="onClickUntagged"
      ></tag-button>
      <tag-button
        class="flex-none"
        v-for="(value, key) in data.drillTags"
        :key="key"
        :name="key"
        :onClick="onClick"
      ></tag-button>
    </nav>
  </div>
</template>

<script setup>
import TagButton from './TagButton.vue'
import { useRoute, useRouter } from 'vue-router'
import { usePageStore } from '../stores/page'
import useBookmarksPage from '../composables/useBookmarksPage'
import { computed, ref, watch } from 'vue'

const { data } = useBookmarksPage()

const router = useRouter()
const route = useRoute()
const store = usePageStore()

const scroller = ref(null)

function onClick(tagName) {
  store.updateTags(tagName, router)
}

function onClickUntagged() {
  store.setUntagged(router)
}

let showCard = computed(() => {
  if (!data.value || data.value.total === 0) {
    return false
  }
  let hasDrillTags = Object.keys(data.value.drillTags).length > 0
  let hasUntaggedFilter = showUntagged.value
  return hasDrillTags || hasUntaggedFilter
})

let showUntagged = computed(() => {
  return !data.value.untagged && data.value.hasUntagged
})

// TODO: This code makes me ugh. Essentially, we want the drill down card to
// scroll to the beginning (i.e. scroll to the left edge) anytime the user
// navigates. But, we want to wait until data fetch completes so that we do not
// scroll prematurely.
//
// To achieve that, we have invented a Rube Goldberg machinery here, which 1)
// requires waiting on the `store.fetchPromise` promise. This itself is a hacky
// abstraction. 2) It is also a leaky abstraction since this promise is in the
// fulfilled state most of the time. Instead, we need to wait until the route
// updates. Only then it is useful to wait for this promise. This is because
// route updates trigger data fetching.
//
// Ideally, it should be possible to simply wait on `data` (defined within this
// component's setup function). Whenever it changes, we should scroll the
// component to the left.
watch(
  () => route.query,
  () => {
    store.fetchPromise.then(() => {
      if (scroller.value) {
        scroller.value.scrollTo({
          left: 0,
          behavior: 'smooth',
        })
      }
    })
  }
)
</script>
