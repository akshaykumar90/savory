export default {
  name: 'LoginCallback',

  data() {
    return {
      error: null,
    }
  },

  async beforeMount() {
    try {
      let resp = await ApiClient.loadUserData()
      const { show_onboarding } = resp.data
      if (show_onboarding) {
        this.$router.replace('/welcome')
        ApiClient.markOnboardingSeen()
      } else {
        this.$router.replace('/')
      }
    } catch (e) {
      this.error = e.toString()
    }
  },

  render() {
    return this.error
  },
}
