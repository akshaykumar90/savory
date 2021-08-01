import LoadingSpinner from './LoadingSpinner.vue'

export default {
  title: 'Savory/Components/LoadingSpinner',
  component: LoadingSpinner,
}

const Template = (args) => ({
  components: { LoadingSpinner },
  props: { args },
  template: '<LoadingSpinner></LoadingSpinner>',
})

export const Default = Template.bind({})
