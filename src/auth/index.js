import { defineStore } from 'pinia'
import { useAuthState } from './authState'
import { computed, ref, watch } from 'vue'
import { Auth0Client } from '@auth0/auth0-spa-js'
import axios from 'axios'
import { clientConfig } from '../api/backend'
import { addXsrfHeader } from '../api/browser'

const CALLBACK_URL = `${window.location.origin}/provider_cb`
const LOGOUT_URL = `${window.location.origin}/logout`

export const useAuth = defineStore('auth', () => {
  const { userId, cleanState, updateState } = useAuthState()

  const auth0Client = new Auth0Client({
    domain: process.env.AUTH0_DOMAIN,
    client_id: process.env.AUTH0_CLIENTID,
    audience: process.env.AUTH0_AUDIENCE,
    redirect_uri: CALLBACK_URL,
  })

  const backendClient = axios.create(clientConfig)

  if (window.chrome && chrome.runtime && chrome.runtime.id) {
    // We are in the Chrome extension
    backendClient.interceptors.request.use(addXsrfHeader)
  }

  const isAuthenticated = computed(() => !!userId.value)

  const getUserId = () => userId.value

  const loading = ref(isAuthenticated.value)

  //////////////////////////////////////////////////////////////////////////////
  // Router navigation guard

  const authGuard = (to, from, next) => {
    const fn = () => {
      let requiredAuthState = to.meta.requiredAuthState
      let currentAuthState = isAuthenticated.value ? 'login' : 'logout'

      if (currentAuthState === requiredAuthState) {
        return next()
      }

      if (requiredAuthState === 'login') {
        return next({ name: 'landing', replace: true })
      }

      return next({ name: 'app', replace: true })
    }

    if (!loading.value) {
      return fn()
    }

    watch(
      () => loading.value,
      (loading) => {
        if (loading === false) {
          return fn()
        }
      }
    )
  }

  //////////////////////////////////////////////////////////////////////////////
  // Login

  function _login(token) {
    return backendClient.post('/login/access-token', { token })
  }

  const redirectCallback = async () => {
    try {
      // If the user is returning to the app after authentication..
      if (
        window.location.search.includes('code=') &&
        window.location.search.includes('state=')
      ) {
        loading.value = true
        // handle the redirect and retrieve tokens
        await auth0Client.handleRedirectCallback()
        // This needs to be awaited so that we do not early-reset
        // `this.loading` in the `finally` block below
        const token = await auth0Client.getTokenSilently()
        const resp = await _login(token)
        updateState(resp.data)
      }
    } catch (e) {
      console.error(e)
    } finally {
      loading.value = false
    }
  }

  /**
   * Authenticates the user using the redirect method
   *
   * Preferred method for login on website.
   *
   * @param initialScreen: Redirect initial state: 'signUp' or 'login'
   */
  const loginWithRedirect = (initialScreen) => {
    const loginOptions = {
      redirect_uri: CALLBACK_URL,
      ...(initialScreen === 'signUp' && { screen_hint: 'signup' }),
    }
    return auth0Client.loginWithRedirect(loginOptions)
  }

  //////////////////////////////////////////////////////////////////////////////
  // Logout

  function _logout() {
    return backendClient.post('/logout')
  }

  const logout = async () => {
    loading.value = true
    try {
      await _logout()
    } catch {
      // do nothing on error, cleanup further below will clean any state anyway
    }
    cleanState()
    // Give some time for any async logout callbacks to finish
    setTimeout(() => {
      auth0Client.logout({ returnTo: LOGOUT_URL })
    }, 1000)
    // No need to `loading.value = false` since this function should always
    // result in a redirect leading to full page reload, wiping all our state
    // clean :)
  }

  //////////////////////////////////////////////////////////////////////////////
  // Token refresh and expiry

  // This is a one-way latch which is set when we detect that the API access
  // token has expired. Its state can be observed, and the app can force logout
  // if the beacon is lit.
  const tokenExpiredBeacon = ref(false)

  let refreshPendingPromise = null

  function _refreshToken() {
    return backendClient.request({
      url: '/login/refresh',
      method: 'post',
      xsrfCookieName: 'csrf_refresh_token',
    })
  }

  const expireToken = () => {
    cleanState()
    tokenExpiredBeacon.value = true
  }

  const tryRefreshToken = async () => {
    if (!refreshPendingPromise) {
      refreshPendingPromise = _refreshToken()
    }
    try {
      // wait for refresh token request to complete
      const resp = await refreshPendingPromise
      updateState(resp.data)
    } catch (err) {
      expireToken()
      throw err
    } finally {
      refreshPendingPromise = null
    }
  }

  //////////////////////////////////////////////////////////////////////////////

  return {
    isAuthenticated,
    getUserId,
    loginWithRedirect,
    redirectCallback,
    logout,
    expireToken,
    tryRefreshToken,
    tokenExpiredBeacon,
    authGuard,
  }
})
