import { createApp } from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'
import { AuthPlugin } from './auth'
import { browser } from './api/browser'
import { eventLogger } from './api/events'
import { clientConfig } from './api/backend'
import { Client } from './api/backend/client'

eventLogger.init(process.env.AMPLITUDE_API_KEY)

const app = createApp(App)

app.use(AuthPlugin, {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  backendClientConfig: clientConfig,
  onLoginCallback: (userId) => {
    const message = { type: 'login', userId }
    if (browser && browser.runtime) {
      browser.runtime.sendMessage(process.env.EXTENSION_ID, message)
    }
    eventLogger.setUserId(userId)
  },
  onLogoutCallback: () => {
    const message = { type: 'logout' }
    if (browser && browser.runtime) {
      browser.runtime.sendMessage(process.env.EXTENSION_ID, message)
    }
    eventLogger.setUserId(null)
  },
})

app.use(store)
app.use(router)

// This cannot happen from within $auth since it is shared by the user-facing
// app and the background extension. This is a no-op in the background
// extension since it cannot prompt the user to log back in (yet). It will
// just become useless and print error messages in the console.
app.$auth.$watch('tokenExpiredBeacon', (beacon) => {
  if (beacon) {
    app.$auth.logout()
  }
})

window.ApiClient = new Client(app.$auth, clientConfig)

app.mount('#app')
