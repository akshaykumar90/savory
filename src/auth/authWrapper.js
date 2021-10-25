import { ref } from 'vue'
import { Auth0Client } from '@auth0/auth0-spa-js'
import axios from 'axios'
import { addXsrfHeader } from '../api/browser'

const DEFAULT_LOGIN_CALLBACK = () => console.log('login...')
const DEFAULT_LOGOUT_CALLBACK = () => console.log('...logout')

const CALLBACK_URL = `${window.location.origin}/provider_cb`
const LOGOUT_URL = window.location.origin

const LOCAL_STORAGE_KEY = '__savory.client.auth_info'
const FIELD_USER_ID = 'user_id'

class AuthState {
  static readStateFromStorage() {
    const rawInfo = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (!rawInfo) {
      // Empty state
      return new this(null)
    }
    let decoded = JSON.parse(rawInfo)
    const userId = decoded[FIELD_USER_ID]
    return new this(userId)
  }

  constructor(userId) {
    this.userId = userId
  }

  get isLoggedIn() {
    return !!this.userId
  }

  cleanState() {
    this.userId = null
    localStorage.removeItem(LOCAL_STORAGE_KEY)
  }

  updateState({ user_id }) {
    this.userId = user_id
    const to = {}
    to[FIELD_USER_ID] = this.userId
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(to))
  }
}

export class AuthClient {
  constructor({
    onLoginCallback,
    onLogoutCallback,
    backendClientConfig,
    isBackground,
    ...options
  }) {
    this.onLoginCallback = onLoginCallback || DEFAULT_LOGIN_CALLBACK
    this.onLogoutCallback = onLogoutCallback || DEFAULT_LOGOUT_CALLBACK
    this.authState = AuthState.readStateFromStorage()
    this.loading = ref(
      this.authState.isLoggedIn ||
        (window.location.search.includes('code=') &&
          window.location.search.includes('state='))
    )
    /**
     * This is a one-way latch which is set when we detect that the API
     * access token has expired. Its state can be observed, and the app
     * can force logout if the beacon is lit.
     */
    this.tokenExpiredBeacon = ref(false)
    this.auth0Client = new Auth0Client({
      domain: options.domain,
      client_id: options.clientId,
      audience: options.audience,
      redirect_uri: CALLBACK_URL,
    })
    this.isBackground = isBackground
    this.backendClient = axios.create(backendClientConfig)
    if (this.isBackground) {
      this.backendClient.interceptors.request.use(addXsrfHeader)
    }
    this.refreshPending = null
  }

  async initialize() {
    if (!this.isBackground) {
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
        this.loading.value = false
      }
    }
  }

  get isAuthenticated() {
    return this.authState.isLoggedIn
  }

  async tryRefreshToken() {
    if (!this.refreshPending) {
      this.refreshPending = this._refreshToken()
    }
    try {
      // wait for refresh token request to complete
      const resp = await this.refreshPending
      this.authState.updateState(resp.data)
    } catch (err) {
      this.expireToken()
      throw err
    } finally {
      this.refreshPending = null
    }
  }

  expireToken() {
    this.authState.cleanState()
    this.tokenExpiredBeacon.value = true
  }

  async onLoginSuccess() {
    const token = await this.auth0Client.getTokenSilently()
    const resp = await this._login(token)
    this.authState.updateState(resp.data)
    this.onLoginCallback(this.authState.userId, token)
  }

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
      this.loading.value = true
      // await not needed because everything happens in background
      this.onLoginSuccess()
    } catch (e) {
      throw e
    } finally {
      this.loading.value = false
    }
  }

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
  }

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
    this.loading.value = true
    await this._logout()
    this.authState.cleanState()
    this.onLogoutCallback()
    // Give some time for any async logout callbacks to finish
    setTimeout(() => {
      this.auth0Client.logout({ returnTo: LOGOUT_URL })
    }, 1000)
  }

  /**
   * Magic login for extension
   *
   * NOTE: This only works in Chrome!
   *
   * FIXME: This and the following function (`silentLogout`) are close to
   * becoming redundant and are potentially detrimental for a good user
   * experience.
   *
   * These functions are remnants of when the extension had to store access
   * tokens for the Stitch backend. Now that we rely on cookies for
   * authentication, and since cookies are automatically sent for requests
   * to the backend API, we do not have to do this dance of passing tokens
   * from the web app to extension.
   *
   * @param userId: All you need is an userId
   */
  silentLogin(userId) {
    this.authState.updateState({ user_id: userId })
    this.tokenExpiredBeacon.value = false
  }

  /**
   * Logout extension from website
   *
   * NOTE: This only works in Chrome!
   */
  silentLogout() {
    this.authState.cleanState()
    this.tokenExpiredBeacon.value = false
  }

  //// Private methods

  _login(token) {
    return this.backendClient.post('/login/access-token', { token })
  }

  _logout() {
    return this.backendClient.post('/logout')
  }

  _refreshToken() {
    return this.backendClient.request({
      url: '/login/refresh',
      method: 'post',
      xsrfCookieName: 'csrf_refresh_token',
    })
  }
}
