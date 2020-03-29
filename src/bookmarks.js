import devtools from '@vue/devtools'
import Vue from 'vue'
import App from './App.vue'
import { store } from './store'
import { router } from './router'

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

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
