import SendFeedback from './SendFeedback.vue'

export default {
  title: 'Savory/Components/SendFeedback',
  component: SendFeedback,
}

const Template = (args) => ({
  components: { SendFeedback },
  props: { args },
  template: '<SendFeedback/>',
})

export const Default = Template.bind({})
