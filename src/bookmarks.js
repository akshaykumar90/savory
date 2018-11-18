import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'
import { createRouter } from './router'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  devtools.connect(/* host, port */)
}

// create store and router instances
const store = createStore()
const router = createRouter()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')