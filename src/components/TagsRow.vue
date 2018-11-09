<template>
  <div class="flex flex-wrap">
    <span v-for="(tag, index) in innerTags" :key="index"
          class="bg-grey-lighter text-teal-dark p-1 m-1 text-center text-xs rounded cursor-pointer border border-teal-dark">
      <span>{{ tag }}</span>
    </span>
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
