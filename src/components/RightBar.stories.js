import RightBar from './RightBar.vue'

export default {
  title: 'Savory/Components/RightBar',
  component: RightBar,
}

const Template = (args) => ({
  components: { RightBar },
  props: { args },
  template: '<RightBar />',
})

export const Default = Template.bind({})
