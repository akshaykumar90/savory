import Vue from 'vue'
import { Auth0Client } from '@auth0/auth0-spa-js'
import { Stitch } from 'mongodb-stitch-browser-sdk'
import { StitchServiceError } from 'mongodb-stitch-core-sdk'
import { login as backendLogin, logout as backendLogout } from '../api/backend'

const DEFAULT_LOGIN_CALLBACK = () => console.log('login...')
const DEFAULT_LOGOUT_CALLBACK = () => console.log('...logout')

const callbackUrl = `${window.location.origin}/provider_cb`

const logoutUrl = window.location.origin

const APP_ID = process.env.STITCH_APP_ID

const mongoApp = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID)

let instance

class AuthState {
  static storage_key = '__savory.client.auth_info'

  static readStateFromStorage() {
    const rawInfo = localStorage.getItem(AuthState.storage_key)
    if (!rawInfo) {
      // Empty state
      return new this(null)
    }
    const userId = rawInfo['user_id']
    return new this(userId)
  }

  constructor(userId) {
    this.userId = userId
  }

  get isLoggedIn() {
    return !!this.userId
  }

  async login(auth0Token) {
    // TODO: Backend should return userId in login response
    let resp = await backendLogin(auth0Token)
    this.userId = resp.userId
    this._writeState()
  }

  async logout() {
    await backendLogout()
    this._cleanState()
  }

  _cleanState() {
    localStorage.removeItem(AuthState.storage_key)
  }

  _writeState() {
    const to = {}
    to['user_id'] = this.userId
    localStorage.setItem(AuthState.storage_key, JSON.stringify(to))
  }
}

const authState = AuthState.readStateFromStorage()

export const getAuthWrapper = () => instance

function handleAuthFailure() {
  // transparently handle access token error
  // by using refresh token
  // if error persists, do what funcWithAuthHandling does
}

function getNewAccessTokenEveryFewMinutes() {}

function funcWithAuthHandling(f, thisArg) {
  return new Proxy(f, {
    apply(target, __, args) {
      const remoteOp = target.apply(thisArg, args)
      remoteOp.catch((ex) => {
        if (
          ex instanceof StitchServiceError &&
          ex.errorCodeName === 'InvalidSession'
        ) {
          instance.isAuthenticated = false
          instance.tokenExpiredBeacon = true
          instance.error = ex
        }
      })
      return remoteOp
    },
  })
}

export const authWrapper = ({
  onLoginCallback = DEFAULT_LOGIN_CALLBACK,
  onLogoutCallback = DEFAULT_LOGOUT_CALLBACK,
  ...options
}) => {
  if (instance) return instance

  const isBackground = !!options.background

  instance = new Vue({
    data() {
      return {
        loading:
          authState.isLoggedIn ||
          (window.location.search.includes('code=') &&
            window.location.search.includes('state=')),
        isAuthenticated: authState.isLoggedIn,
        auth0Client: null,
        error: null,
        /**
         * This is a one-way latch which is set when we detect that the
         * MongoDB Stitch access token has expired. Its state can be observed,
         * and the app can force logout if the beacon is lit.
         */
        tokenExpiredBeacon: null,
      }
    },
    methods: {
      getMongoApp() {
        return {
          callFunction: funcWithAuthHandling(mongoApp.callFunction, mongoApp),
        }
      },

      async onLoginSuccess() {
        const token = await this.auth0Client.getTokenSilently()
        await authState.login(token)
        const userId = authState.userId
        this.isAuthenticated = true
        onLoginCallback(userId, token)
      },

      /**
       * Login via popup. Used by extension to login.
       *
       * Should not be called from the website, since popups are usually
       * blocked.
       *
       * We retrieve both Auth0 as well as MongoDB Stitch access tokens here.
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
          this.error = null
          this.loading = true
          // await not needed because everything happens in background
          this.onLoginSuccess()
        } catch (e) {
          this.error = e
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
          redirect_uri: callbackUrl,
          ...(initialScreen === 'signUp' && { screen_hint: 'signup' }),
        }
        return this.auth0Client.loginWithRedirect(loginOptions)
      },

      /**
       * Logs out the user from MongoDB Stitch as well as Auth0
       *
       * This method will cause a full-page reload. Any in-memory state would
       * therefore be lost. This is the desired (and load-bearing) behavior.
       * If we do not clear state after logging out, the user on logging in
       * again will either see double the bookmarks, or see previous user's
       * bookmarks.
       */
      async logout() {
        this.loading = true
        await authState.logout()
        this.isAuthenticated = false
        onLogoutCallback()
        // Give some time for any async logout callbacks to finish
        setTimeout(() => {
          this.auth0Client.logout({ returnTo: logoutUrl })
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
      async loginStitch(token) {
        await authState.login(token)
        this.isAuthenticated = !!this.user
        this.tokenExpiredBeacon = null
        this.error = null
      },

      /**
       * Logout extension from website
       *
       * NOTE: This only works in Chrome!
       */
      async logoutStitch() {
        await authState.logout()
        this.isAuthenticated = false
        this.tokenExpiredBeacon = null
        this.error = null
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
        redirect_uri: callbackUrl,
      })
      if (!isBackground) {
        try {
          // If the user is returning to the app after authentication..
          if (
            window.location.search.includes('code=') &&
            window.location.search.includes('state=')
          ) {
            // handle the redirect and retrieve tokens
            await this.auth0Client.handleRedirectCallback()
            this.error = null
            // This needs to be awaited so that we do not early-reset
            // `this.loading` in the `finally` block below
            await this.onLoginSuccess()
          }
        } catch (e) {
          this.error = e
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
