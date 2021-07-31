import OnboardingNeedHelp from './NeedHelp.vue'

export default {
  title: 'Savory/Onboarding/NeedHelp',
  component: OnboardingNeedHelp,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingNeedHelp },
  props: { args },
  template: '<onboarding-need-help v-bind="$props"/>',
})

export const Default = Template.bind({})
