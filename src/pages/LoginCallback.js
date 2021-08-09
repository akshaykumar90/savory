import { EVENT_SIGNUP_SUCCESS, eventLogger } from '../api/events'

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
      const { login_count, show_onboarding } = resp.data
      if (login_count === 1) {
        // We provide `/provider_cb` as the success callback to Auth0 which
        // is handled by this component. If this is the first login for this
        // user, this must be a successful signup event.
        eventLogger.logEvent(EVENT_SIGNUP_SUCCESS)
      }
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
