import BookmarkRow from './BookmarkRow.vue'

export default {
  title: 'Savory/Components/BookmarkRow',
  component: BookmarkRow,
}

const Template = (args) => ({
  components: { BookmarkRow },
  props: { args },
  template: '<BookmarkRow v-bind="$props"/>',
})

export const Default = Template.bind({})
Default.args = {
  bookmarkId: '1',
}
