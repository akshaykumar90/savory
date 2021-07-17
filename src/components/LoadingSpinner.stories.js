import LoadingSpinner from './LoadingSpinner.vue'

export default {
  title: 'Savory/LoadingSpinner',
  component: LoadingSpinner,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { LoadingSpinner },
  props: { args },
  template: '<LoadingSpinner></LoadingSpinner>',
})

export const Default = Template.bind({})
