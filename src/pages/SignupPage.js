export default {
  name: 'signup-page',

  created() {
    this.$auth.loginWithRedirect('signUp')
  },

  render: function (h) {
    return h() // avoid warning message
  },
}
