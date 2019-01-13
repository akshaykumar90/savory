<template>
  <div class="list-view">
    <h1 class="mb-6 leading-tight text-grey-darkest text-4xl font-bold">{{ current.title }}</h1>
    <div
      class="my-4"
      v-for="item in current.content">
      <div>
        <p
          class="leading-normal text-base"
          v-for="text in item.preface">
          {{ text }}
        </p>
      </div>
      <div
        class="my-5 pl-2 border-l-4 border-teal-dark"
        v-for="link in item.bookmarks"
        v-bind:key="link">
        <BookmarkRow v-bind:bookmark-id="link"/>
      </div>
    </div>
  </div>
</template>

<script>
  import BookmarkRow from './BookmarkRow.vue'

  export default {
    name: 'LinkList',

    components: {
      BookmarkRow,
    },

    computed: {
      current () {
        return this.$store.getters.activeListicle
      }
    }
  }
</script>

<style lang="stylus">
.list-view
  p
    margin-bottom: 0.5rem
    &:last-child
      margin-bottom: 0
</style>