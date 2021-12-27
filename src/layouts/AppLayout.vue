<template>
  <div>
    <header
      class="w-full fixed top-0 h-16 z-10 bg-red-200 transition-shadow duration-300"
      :class="{ 'shadow-lg': scrollTop > 0 }"
    ></header>
    <div class="h-16"></div>
  </div>
  <div class="w-[1500px] mx-auto grid grid-cols-6 gap-4">
    <nav class="bg-green-200">
      <div class="space-y-10 sticky top-0">
        <p>Home</p>
        <p>Reading</p>
        <p>Podcasts</p>
        <p>Watching</p>
      </div>
    </nav>
    <main class="col-span-3" ref="main">
      <div class="space-y-2">
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
        <bookmark-row />
      </div>
    </main>
    <section class="col-span-2">
      <edit-panel />
    </section>
  </div>
</template>

<script>
import BookmarkRow from '../components/BookmarkRow.vue'
import EditPanel from '../components/EditPanel.vue'
import { useScroll } from '@vueuse/core'

export default {
  name: 'app-layout',
  components: {
    BookmarkRow,
    EditPanel,
  },
  setup() {
    const { y } = useScroll(window)
    return {
      scrollTop: y,
    }
  },
}
</script>
