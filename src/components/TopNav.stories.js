import TopNav from './TopNav.vue'

export default {
  title: 'Savory/Components/TopNav',
  component: TopNav,
  argTypes: {
    onLogout: {
      action: 'logout',
    },
  },
}

const Template = (args, { argTypes }) => ({
  components: { TopNav },
  props: Object.keys(argTypes),
  template: '<top-nav v-bind="$props" v-on="$props"/>',
})

export const Default = Template.bind({})
Default.args = {
  testMode: false,
  isSaving: false,
  isAuthLoading: false,
  isAuthenticated: true,
}

export const Saving = Template.bind({})
Saving.args = {
  ...Default.args,
  isSaving: true,
}

export const TestMode = Template.bind({})
TestMode.args = {
  ...Default.args,
  testMode: true,
}
