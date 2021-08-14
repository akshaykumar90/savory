import OnboardingNeedHelp from './NeedHelp.vue'

export default {
  title: 'Savory/Onboarding/NeedHelp',
  component: OnboardingNeedHelp,
  decorators: [
    () => ({
      template:
        '<div class="max-w-3xl mx-auto text-center lg:py-8"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingNeedHelp },
  props: { args },
  template: '<onboarding-need-help v-bind="$props"/>',
})

export const Default = Template.bind({})
