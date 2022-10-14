import { createApp } from 'vue'
import App from './Playground.vue'
import '../assets/app.css'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { Client } from '../api/backend/client'

const app = createApp(App)

app.use(createPinia())

app.use(VueQueryPlugin)

window.ApiClient = new Client(
  {},
  {
    baseURL: 'https://api.savory.test:8081/api/v1',
    withCredentials: true,
  }
)

app.mount('#app')
