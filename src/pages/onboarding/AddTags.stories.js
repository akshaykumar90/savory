import OnboardingAddTags from './AddTags.vue'

export default {
  title: 'Savory/Onboarding/AddTags',
  component: OnboardingAddTags,
  decorators: [
    () => ({
      template:
        '<div class="max-w-3xl mx-auto text-center lg:py-8"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingAddTags },
  props: { args },
  template: '<onboarding-add-tags v-bind="$props"/>',
})

export const Default = Template.bind({})
