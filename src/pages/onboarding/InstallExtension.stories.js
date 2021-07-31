import OnboardingInstallExtension from './InstallExtension.vue'

export default {
  title: 'Savory/Onboarding/InstallExtension',
  component: OnboardingInstallExtension,
  decorators: [
    () => ({
      template:
        '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
    }),
  ],
}

const Template = (args) => ({
  components: { OnboardingInstallExtension },
  props: { args },
  template: '<onboarding-install-extension v-bind="$props"/>',
})

export const Default = Template.bind({})
