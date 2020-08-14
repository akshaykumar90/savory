import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'
import { AuthPlugin } from './auth'

const isDev = process.env.NODE_ENV !== 'production'
const enableDevtools = process.env.DEVTOOLS === 'true'

if (isDev && enableDevtools) {
  devtools.connect(/* host, port */)
}

chrome.runtime.onMessage.addListener((p) => store.dispatch(p))

// This is the event hub we'll use in every
// component to communicate between them.
window.Event = new Vue()

// Clicking outside tags row input should exit edit mode
// Inspired from: https://stackoverflow.com/a/36180348/7003143
// Also see `collapseSiblings` in TagsRow.vue
document.body.addEventListener('click', (event) => {
  Event.$emit('exitEditMode', {})
})

Vue.use(AuthPlugin, {
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  onLoginCallback: (token) => {
    chrome.runtime.sendMessage({ type: 'login', token })
  },
  onLogoutCallback: () => {
    chrome.runtime.sendMessage({ type: 'logout' })
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
