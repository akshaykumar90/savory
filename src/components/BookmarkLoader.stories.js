import BookmarkLoader from './BookmarkLoader.vue'

export default {
  title: 'Savory/BookmarkLoader',
  component: BookmarkLoader,
}

const Template = (args) => ({
  components: { BookmarkLoader },
  props: { args },
  template: '<bookmark-loader v-bind="$props"/>',
})

export const Default = Template.bind({})
