import Vue from 'vue'
import { Auth0Client } from '@auth0/auth0-spa-js'
import axios from 'axios'

const DEFAULT_LOGIN_CALLBACK = () => console.log('login...')
const DEFAULT_LOGOUT_CALLBACK = () => console.log('...logout')

const EXPIRATION_WINDOW_SECS = 300
const SLEEP_MILLIS = 60000

const CALLBACK_URL = `${window.location.origin}/provider_cb`
const LOGOUT_URL = window.location.origin

let instance

export const getAuthWrapper = () => instance

class AuthState {
  static storage_key = '__savory.client.auth_info'

  static readStateFromStorage() {
    const rawInfo = localStorage.getItem(AuthState.storage_key)
    if (!rawInfo) {
      // Empty state
      return new this(null, null)
    }
    const userId = rawInfo['user_id']
    const expiresAt = rawInfo['eat']
    return new this(userId, expiresAt)
  }

  constructor(userId, expiresAt) {
    this.userId = userId
    this.expiresAt = expiresAt
  }

  get isLoggedIn() {
    return !!this.userId
  }

  cleanState() {
    this.userId = null
    this.expiresAt = null
    localStorage.removeItem(AuthState.storage_key)
  }

  updateState({ user_id, expires_at }) {
    // This function is called for login as well as refresh token responses.
    // The refresh token response only has the new `expires_at`.
    if (user_id) {
      this.userId = user_id
    }
    this.expiresAt = expires_at
    const to = {}
    to['user_id'] = this.userId
    to['eat'] = this.expiresAt
    localStorage.setItem(AuthState.storage_key, JSON.stringify(to))
  }
}

export const authWrapper = ({
  onLoginCallback = DEFAULT_LOGIN_CALLBACK,
  onLogoutCallback = DEFAULT_LOGOUT_CALLBACK,
  backendClientConfig,
  ...options
}) => {
  if (instance) return instance

  const isBackground = !!options.background

  const authState = AuthState.readStateFromStorage()

  instance = new Vue({
    data() {
      return {
        loading:
          authState.isLoggedIn ||
          (window.location.search.includes('code=') &&
            window.location.search.includes('state=')),
        auth0Client: null,
        backendClient: null,
        /**
         * This is a one-way latch which is set when we detect that the API
         * access token has expired. Its state can be observed, and the app
         * can force logout if the beacon is lit.
         */
        tokenExpiredBeacon: null,
        refreshPending: null,
        nextTimeout: null,
      }
    },
    methods: {
      isAuthenticated() {
        return authState.isLoggedIn
      },

      _login(token) {
        return this.backendClient.post('/login/access-token', { token })
      },

      _logout() {
        return this.backendClient.post('/logout')
      },

      _refreshToken() {
        return this.backendClient.post('/refresh')
      },

      _runRefreshLoop() {
        if (
          !authState.isLoggedIn ||
          Date.now() / 1000 < authState.expiresAt - EXPIRATION_WINDOW_SECS
        ) {
          this.nextTimeout = setTimeout(
            () => this._runRefreshLoop(),
            SLEEP_MILLIS
          )
          return
        }

        this.tryRefreshToken().finally(() => {
          this.nextTimeout = setTimeout(
            () => this._runRefreshLoop(),
            SLEEP_MILLIS
          )
        })
      },

      async tryRefreshToken() {
        if (!this.refreshPending) {
          this.refreshPending = this._refreshToken()
        }
        try {
          // wait for refresh token request to complete
          const resp = await this.refreshPending
          // TODO: update resp to have updated expiresAt
          authState.updateState(resp)
        } catch (err) {
          this.expireToken()
          throw err
        } finally {
          this.refreshPending = null
        }
      },

      expireToken() {
        authState.cleanState()
        this.tokenExpiredBeacon = true
      },

      async onLoginSuccess() {
        const token = await this.auth0Client.getTokenSilently()
        // TODO: get userId and expiresAt in resp
        const resp = await this._login(token)
        authState.updateState(resp)
        onLoginCallback(authState.userId, token)
      },

      /**
       * Login via popup. Used by extension to login.
       *
       * Should not be called from the website, since popups are usually
       * blocked.
       *
       * @param initialScreen: Popup initial state: 'signUp' or 'login'
       */
      async loginWithPopup(initialScreen) {
        // https://community.auth0.com/t/how-to-change-initial-screen-to-sign-up-using-auth0-spa-js-universal-login/32941/9
        const loginOptions = {
          ...(initialScreen === 'signUp' && { screen_hint: 'signup' }),
        }
        try {
          // Popup errors out with a timeout if we just close it without
          // logging in
          await this.auth0Client.loginWithPopup(loginOptions)
          this.loading = true
          // await not needed because everything happens in background
          this.onLoginSuccess()
        } catch (e) {
          throw e
        } finally {
          this.loading = false
        }
      },

      /**
       * Authenticates the user using the redirect method
       *
       * Preferred method for login on website.
       *
       * @param initialScreen: Redirect initial state: 'signUp' or 'login'
       */
      loginWithRedirect(initialScreen) {
        const loginOptions = {
          redirect_uri: CALLBACK_URL,
          ...(initialScreen === 'signUp' && { screen_hint: 'signup' }),
        }
        return this.auth0Client.loginWithRedirect(loginOptions)
      },

      /**
       * Logs out the user
       *
       * This method will cause a full-page reload. Any in-memory state would
       * therefore be lost. This is the desired (and load-bearing) behavior.
       * If we do not clear state after logging out, the user on logging in
       * again will either see double the bookmarks, or see previous user's
       * bookmarks.
       */
      async logout() {
        this.loading = true
        await this._logout()
        authState.cleanState()
        onLogoutCallback()
        // Give some time for any async logout callbacks to finish
        setTimeout(() => {
          this.auth0Client.logout({ returnTo: LOGOUT_URL })
        }, 1000)
      },

      /**
       * Magic login for extension
       *
       * Website login can pass the token to the extension via this method.
       *
       * NOTE: This only works in Chrome!
       *
       * @param token: A valid Auth0 access token
       */
      async silentLogin(token) {
        const resp = await this._login(token)
        authState.updateState(resp)
        this.tokenExpiredBeacon = null
      },

      /**
       * Logout extension from website
       *
       * NOTE: This only works in Chrome!
       */
      async silentLogout() {
        await this._logout()
        authState.cleanState()
        this.tokenExpiredBeacon = null
      },

      async getAuth0Token() {
        try {
          return await this.auth0Client.getTokenSilently()
        } catch (e) {
          console.error(e)
          return null
        }
      },
    },

    async created() {
      this.auth0Client = new Auth0Client({
        domain: options.domain,
        client_id: options.clientId,
        audience: options.audience,
        redirect_uri: CALLBACK_URL,
      })
      this.backendClient = axios.create(backendClientConfig)
      this._runRefreshLoop()
      if (!isBackground) {
        try {
          // If the user is returning to the app after authentication..
          if (
            window.location.search.includes('code=') &&
            window.location.search.includes('state=')
          ) {
            // handle the redirect and retrieve tokens
            await this.auth0Client.handleRedirectCallback()
            // This needs to be awaited so that we do not early-reset
            // `this.loading` in the `finally` block below
            await this.onLoginSuccess()
          }
        } catch (e) {
          console.error(e)
        } finally {
          this.loading = false
        }
      }
    },
  })

  return instance
}

export const AuthPlugin = {
  install(Vue, options) {
    Vue.prototype.$auth = authWrapper(options)
  },
}
