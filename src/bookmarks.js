import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { createStore } from './store'

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  devtools.connect(/* host, port */)
}

const store = createStore()

new Vue({
  store,
  render: h => h(App)
}).$mount('#app')