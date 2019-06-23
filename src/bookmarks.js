import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'
import { setupListeners } from './api'

const isDev = process.env.NODE_ENV === 'development'
const enableDevtools = process.env.DEVTOOLS === 'true'

if (isDev && enableDevtools) {
  devtools.connect(/* host, port */)
}

// create store and router instances
const store = createStore()
const router = createRouter()

setupListeners(store.dispatch)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')