import RightBar from './RightBar.vue'

export default {
  title: 'Savory/RightBar',
  component: RightBar,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { RightBar },
  props: { args },
  template: '<RightBar />',
})

export const Default = Template.bind({})
