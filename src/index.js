import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'
import { AuthPlugin } from './auth'

const isDev = process.env.NODE_ENV !== 'production'
const enableDevtools = process.env.DEVTOOLS === 'true'

if (process.env.RUNTIME_CONTEXT === 'webext' && isDev && enableDevtools) {
  devtools.connect(/* host, port */)
}

if (process.env.RUNTIME_CONTEXT === 'webext') {
  chrome.runtime.onMessage.addListener((p) => store.dispatch(p))
}

// This is the event hub we'll use in every
// component to communicate between them.
window.Event = new Vue()

// Clicking outside tags row input should exit edit mode
// Inspired from: https://stackoverflow.com/a/36180348/7003143
// Also see `collapseSiblings` in TagsRow.vue
document.body.addEventListener('click', (event) => {
  Event.$emit('exitEditMode', {})
})

const auth0CallbackUrl =
  process.env.RUNTIME_CONTEXT === 'webapp'
    ? 'http://localhost:8080'
    : `chrome-extension://${chrome.runtime.id}/provider_cb`

const auth0LogoutUrl =
  process.env.RUNTIME_CONTEXT === 'webapp'
    ? 'http://localhost:8080'
    : `chrome-extension://${chrome.runtime.id}/bookmarks.html#/logout`

Vue.use(AuthPlugin, {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  callbackUrl: auth0CallbackUrl,
  logoutUrl: auth0LogoutUrl,
  onLoginCallback: (token) => {
    const message = { type: 'login', token }
    if (process.env.RUNTIME_CONTEXT === 'webext') {
      chrome.runtime.sendMessage(message)
    } else {
      chrome.runtime.sendMessage(process.env.EXTENSION_ID, message)
    }
  },
  onLogoutCallback: () => {
    const message = { type: 'logout' }
    if (process.env.RUNTIME_CONTEXT === 'webext') {
      chrome.runtime.sendMessage(message)
    } else {
      chrome.runtime.sendMessage(process.env.EXTENSION_ID, message)
    }
  },
})

const app = new Vue({
  router,
  store,
  render: (h) => h(App),
})

// This cannot happen from within $auth since it is shared by the user-facing
// app and the background extension. This is a no-op in the background
// extension since it cannot prompt the user to log back in (yet). It will
// just become useless and print error messages in the console.
app.$auth.$watch('tokenExpiredBeacon', (beacon) => {
  if (beacon) {
    app.$auth.logout()
  }
})

app.$mount('#app')
