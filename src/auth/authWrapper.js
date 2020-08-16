import Vue from 'vue'
import createAuth0Client from '@auth0/auth0-spa-js'
import { CustomCredential, Stitch } from 'mongodb-stitch-browser-sdk'
import { StitchServiceError } from 'mongodb-stitch-core-sdk'

/** Define a default action to perform after authentication */
const DEFAULT_REDIRECT_CALLBACK = () =>
  window.history.replaceState({}, document.title, window.location.pathname)

const APP_ID = process.env.STITCH_APP_ID

const mongoApp = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID)

let instance

export const getAuthWrapper = () => instance

export const authWrapper = ({
  onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
  onLoginCallback,
  onLogoutCallback,
  callbackUrl,
  logoutUrl,
  ...options
}) => {
  if (instance) return instance

  const isBackground = !!options.background

  instance = new Vue({
    data() {
      return {
        loading:
          mongoApp.auth.isLoggedIn ||
          (window.location.search.includes('code=') &&
            window.location.search.includes('state=')),
        popupOpen: false,
        isAuthenticated: mongoApp.auth.isLoggedIn,
        user: mongoApp.auth.user,
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
        return mongoApp
      },

      /**
       * This is the main entrypoint for user-facing login
       *
       * Should not be called from the background extension. See `loginStitch`
       * below for how to login in background.
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
        this.popupOpen = true
        try {
          // Popup errors out with a timeout if we just close it without
          // logging in
          await this.auth0Client.loginWithPopup(loginOptions)
          this.error = null
          this.loading = true
          const token = await this.auth0Client.getTokenSilently()
          await mongoApp.auth.loginWithCredential(new CustomCredential(token))
          this.user = mongoApp.auth.user
          this.isAuthenticated = true
          onLoginCallback(token)
        } catch (e) {
          this.error = e
          throw e
        } finally {
          this.popupOpen = false
          this.loading = false
        }
      },

      /** Authenticates the user using the redirect method */
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
       * Should not be called from the background extension. See `logoutStitch`
       * below for how to logout in background.
       *
       * This method will cause a full-page reload. Any in-memory state would
       * therefore be lost. This is the desired (and load-bearing) behavior.
       * If we do not clear state after logging out, the user on logging in
       * again will either see double the bookmarks, or see previous user's
       * bookmarks.
       */
      async logout() {
        this.loading = true
        await mongoApp.auth.logout()
        this.user = null
        this.isAuthenticated = false
        onLogoutCallback()
        // Give some time for any async logout callbacks to finish
        setTimeout(() => {
          this.auth0Client.logout({ returnTo: logoutUrl })
        }, 1000)
      },

      /**
       * Used by the background extension for login
       *
       * The background extension does not have an auth0client by design, and
       * must receive the Auth0 access token from _somewhere_ to login.
       *
       * @param token: A valid Auth0 access token
       */
      async loginStitch(token) {
        console.log('Logging in...')
        await mongoApp.auth.loginWithCredential(new CustomCredential(token))
        this.user = mongoApp.auth.user
        this.isAuthenticated = !!this.user
        this.tokenExpiredBeacon = null
        this.error = null
      },

      /**
       * Used by the background extension for logout
       */
      async logoutStitch() {
        console.log('Logging out...')
        await mongoApp.auth.logout()
        this.user = null
        this.isAuthenticated = false
        this.tokenExpiredBeacon = null
        this.error = null
      },

      /**
       * This is used to wrap MongoDB Stitch API calls so that we can detect
       * expired tokens ASAP.
       *
       * Intercepts method on `obj` such that rejected promises due to invalid
       * session errors flip the authenticated state. Expects the methods on
       * `obj` to return promises.
       *
       * @param obj: Object to wrap
       * @returns A proxy for the wrapped object
       */
      withAuthHandling(obj) {
        const authVm = this
        const handler = {
          get(target, propKey, receiver) {
            if (typeof target[propKey] !== 'function') {
              return Reflect.get(target, propKey, receiver)
            }
            const origMethod = target[propKey]
            return function (...args) {
              if (!authVm.isAuthenticated) {
                return Promise.reject('Not logged in!')
              }
              const remoteOp = origMethod.apply(this, args)
              remoteOp
                .then(() => {
                  authVm.loading = false
                })
                .catch((ex) => {
                  if (
                    ex instanceof StitchServiceError &&
                    ex.errorCodeName === 'InvalidSession'
                  ) {
                    authVm.isAuthenticated = false
                    authVm.user = null
                    authVm.tokenExpiredBeacon = true
                    authVm.error = ex
                  }
                })
              return remoteOp
            }
          },
        }
        return new Proxy(obj, handler)
      },
    },
    async created() {
      if (!isBackground) {
        this.auth0Client = await createAuth0Client({
          domain: options.domain,
          client_id: options.clientId,
          audience: options.audience,
          redirect_uri: callbackUrl,
        })
        try {
          // If the user is returning to the app after authentication..
          if (
            window.location.search.includes('code=') &&
            window.location.search.includes('state=')
          ) {
            // handle the redirect and retrieve tokens
            const { appState } = await this.auth0Client.handleRedirectCallback()
            this.error = null
            const token = await this.auth0Client.getTokenSilently()
            await mongoApp.auth.loginWithCredential(new CustomCredential(token))
            this.user = mongoApp.auth.user
            this.isAuthenticated = true
            onLoginCallback(token)
            // Notify subscribers that the redirect callback has happened, passing the appState
            // (useful for retrieving any pre-authentication state)
            onRedirectCallback(appState)
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
