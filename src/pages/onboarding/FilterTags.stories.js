import OnboardingFilterTags from './FilterTags.vue'

export default {
  title: 'Savory/Onboarding/FilterTags',
  component: OnboardingFilterTags,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingFilterTags },
  props: { args },
  template: '<onboarding-filter-tags v-bind="$props"/>',
})

export const Default = Template.bind({})
