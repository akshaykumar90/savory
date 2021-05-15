import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'
import { AuthPlugin } from './auth'
import { browser } from './api/browser'
import { eventLogger } from './api/events'

eventLogger.init(process.env.AMPLITUDE_API_KEY)

// This is the event hub we'll use in every
// component to communicate between them.
window.Event = new Vue()

Vue.use(AuthPlugin, {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  onLoginCallback: (userId, token) => {
    const message = { type: 'login', token }
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

if (process.env.NODE_ENV !== 'production') {
  if (app.$auth.user) {
    console.log(`Logged in as: ${app.$auth.user.identities[0].id}`)
  }
}
