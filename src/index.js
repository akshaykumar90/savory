import { createApp, watch } from 'vue'
import App from './App.vue'
import { getRouter } from './router'
import { AuthClient } from './auth'
import { browser } from './api/browser'
import { eventLogger } from './api/events'
import { clientConfig } from './api/backend'
import { Client } from './api/backend/client'

eventLogger.init(process.env.AMPLITUDE_API_KEY)

const app = createApp(App)

const auth = new AuthClient({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  backendClientConfig: clientConfig,
  isBackground: false,
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

app.config.globalProperties.$auth = auth

const router = getRouter(auth)

app.use(router)

// This cannot happen from within authClient since it is shared by the user-facing
// app and the background extension. This is a no-op in the background
// extension since it cannot prompt the user to log back in (yet). It will
// just become useless and print error messages in the console.
watch(auth.tokenExpiredBeacon, (beacon) => {
  if (beacon) {
    auth.logout()
  }
})

window.ApiClient = new Client(auth, clientConfig)

app.mount('#app')

auth.initialize()
