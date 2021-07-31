import OnboardingSaveLink from './SaveLink.vue'

export default {
  title: 'Savory/Onboarding/SaveLink',
  component: OnboardingSaveLink,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingSaveLink },
  props: { args },
  template: '<onboarding-save-link v-bind="$props"/>',
})

export const Default = Template.bind({})
