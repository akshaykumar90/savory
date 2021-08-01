import OnboardingSaveLink from './SaveLink.vue'

export default {
  title: 'Savory/Onboarding/SaveLink',
  component: OnboardingSaveLink,
  decorators: [
    () => ({
      template:
        '<div class="max-w-3xl mx-auto text-center lg:py-8"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingSaveLink },
  props: { args },
  template: '<onboarding-save-link v-bind="$props"/>',
})

export const Default = Template.bind({})
