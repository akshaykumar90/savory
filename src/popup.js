import { useAuth } from './auth'
import { clientConfig } from './api/backend'
import { Client } from './api/backend/client'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Popup from './Popup.vue'

const app = createApp(Popup)

app.use(createPinia())

const authStore = useAuth()

window.ApiClient = new Client(authStore, clientConfig)

app.mount('#savory-chrome-extension-app')
