import Vue from 'vue'
import createAuth0Client from '@auth0/auth0-spa-js'

let instance

export const getInstance = () => instance

export const useAuth0 = ({
  onLoginCallback,
  onLogoutCallback,
  redirectUri = `chrome-extension://${chrome.runtime.id}/provider_cb`,
  ...options
}) => {
  if (instance) return instance

  instance = new Vue({
    data() {
      return {
        loading: true,
        popupOpen: false,
        isAuthenticated: false,
        user: {},
        auth0Client: null,
        error: null
      }
    },
    methods: {
      async loginWithPopup() {
        this.popupOpen = true

        try {
          await this.auth0Client.loginWithPopup()
          this.user = await this.auth0Client.getUser()
          this.isAuthenticated = await this.auth0Client.isAuthenticated()
          this.error = null
          const token = await this.auth0Client.getTokenSilently()
          onLoginCallback(token)
        } catch (e) {
          console.error(e)
          this.error = e
        } finally {
          this.popupOpen = false
        }
      },
      async logout() {
        onLogoutCallback()
        // The URL where Auth0 will redirect the browser to after the logout.
        // This will re-load the extension hence any in-memory state would be
        // lost. I think this is _ok_ for a logout scenario.
        const returnTo = `chrome-extension://${chrome.runtime.id}/bookmarks.html#/logout`
        // Give some time for any async logout callbacks to finish
        setTimeout(() => {
          this.auth0Client.logout({ returnTo })
        }, 1000)
      },
    },
    async created() {
      this.auth0Client = await createAuth0Client({
        domain: options.domain,
        client_id: options.clientId,
        audience: options.audience,
        redirect_uri: redirectUri,
      })

      this.isAuthenticated = await this.auth0Client.isAuthenticated()
      this.user = await this.auth0Client.getUser()
      this.loading = false
      if (this.isAuthenticated) {
        const token = await this.auth0Client.getTokenSilently()
        onLoginCallback(token)
      }
    }
  })

  return instance
}

export const Auth0Plugin = {
  install(Vue, options) {
    Vue.prototype.$auth = useAuth0(options)
  }
}
