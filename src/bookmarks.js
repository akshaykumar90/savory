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

// This is the event hub we'll use in every
// component to communicate between them.
window.Event = new Vue()

// Clicking outside tags row input should exit edit mode
// Inspired from: https://stackoverflow.com/a/36180348/7003143
// Also see `collapseSiblings` in TagsRow.vue
document.body.addEventListener('click', event => {
  Event.$emit('exitEditMode', {})
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')