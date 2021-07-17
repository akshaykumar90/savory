import BookmarkRow from './BookmarkRow.vue'

export default {
  title: 'Savory/BookmarkRow',
  component: BookmarkRow,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
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
