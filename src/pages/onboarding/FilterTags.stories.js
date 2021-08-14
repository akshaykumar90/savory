import OnboardingFilterTags from './FilterTags.vue'

export default {
  title: 'Savory/Onboarding/FilterTags',
  component: OnboardingFilterTags,
  decorators: [
    () => ({
      template:
        '<div class="max-w-3xl mx-auto text-center lg:py-8"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingFilterTags },
  props: { args },
  template: '<onboarding-filter-tags v-bind="$props"/>',
})

export const Default = Template.bind({})
