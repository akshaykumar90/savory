<template>
  <div class="flex flex-wrap items-end pt-2">
    <span v-for="(tag, index) in innerTags" :key="index"
          class="bg-grey-lighter text-teal-dark p-1 mr-2 text-center text-xs rounded cursor-pointer border border-teal-dark">
      <span>{{ tag }}</span>
    </span>
    <input type="text" title="new-tag"
           class="block text-teal-darker font-xs bg-grey-lighter focus:bg-grey-light focus:outline-none rounded px-2 py-2 h-6">
  </div>
</template>

<script>
  export default {
    name: "tags-row",

    props: {
      value: {
        type: Array,
        default: () => []
      }
    },

    data () {
      return {
        innerTags: [...this.value]
      }
    }
  }
</script>
