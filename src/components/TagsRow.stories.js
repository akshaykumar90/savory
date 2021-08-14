import TagsRow from './TagsRow.vue'

export default {
  title: 'Savory/Components/TagsRow',
  component: TagsRow,
}

const Template = (args) => ({
  components: { TagsRow },
  props: { args },
  template: '<TagsRow v-bind="$props"/>',
})

export const Default = Template.bind({})
Default.args = {
  bookmarkId: '1',
}
