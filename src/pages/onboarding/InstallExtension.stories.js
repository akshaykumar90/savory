import OnboardingInstallExtension from './InstallExtension.vue'

export default {
  title: 'Savory/Onboarding/InstallExtension',
  component: OnboardingInstallExtension,
  decorators: [
    () => ({
      template:
        '<div class="max-w-3xl mx-auto text-center lg:py-8"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingInstallExtension },
  props: { args },
  template: '<onboarding-install-extension v-bind="$props"/>',
})

export const Default = Template.bind({})
