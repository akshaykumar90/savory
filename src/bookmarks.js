import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'
import { Auth0Plugin } from './auth'

import { domain, clientId, audience } from '../auth_config.json'
import {
  mongoApp,
  onLogin as mongoAppLogin,
  onLogout as mongoAppLogout
} from './api/mongodb'

const isDev = process.env.NODE_ENV === 'development'
const enableDevtools = process.env.DEVTOOLS === 'true'

if (isDev && enableDevtools) {
  devtools.connect(/* host, port */)
}

chrome.runtime.onMessage.addListener(({ type, bookmark }) => {
  store.dispatch({ type, bookmark })
})

// This is the event hub we'll use in every
// component to communicate between them.
window.Event = new Vue()

// Clicking outside tags row input should exit edit mode
// Inspired from: https://stackoverflow.com/a/36180348/7003143
// Also see `collapseSiblings` in TagsRow.vue
document.body.addEventListener('click', event => {
  Event.$emit('exitEditMode', {})
})

Event.$on('login', mongoAppLogin)
Event.$on('logout', mongoAppLogout)

Vue.use(Auth0Plugin, {
  domain,
  clientId,
  audience,
  onLoginCallback: token => {
    Event.$emit('login', { token })
    chrome.runtime.sendMessage({ type: 'login', token })
  },
  onLogoutCallback: () => {
    Event.$emit('logout')
    chrome.runtime.sendMessage({ type: 'logout' })
  }
})

const { auth } = mongoApp

if (auth.isLoggedIn) {
  store.dispatch('SYNC_BOOKMARKS')
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
