import OnboardingAddTags from './AddTags.vue'

export default {
  title: 'Savory/Onboarding/AddTags',
  component: OnboardingAddTags,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingAddTags },
  props: { args },
  template: '<onboarding-add-tags v-bind="$props"/>',
})

export const Default = Template.bind({})
