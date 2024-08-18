import { useAuth } from './auth'
import { clientConfig } from './api/backend/config'
import { Client } from './api/backend/client'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Popup from './Popup.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { addXsrfHeader } from './api/browser'

const app = createApp(Popup)

app.use(createPinia())

app.use(VueQueryPlugin)

const authStore = useAuth()

window.ApiClient = new Client(authStore, clientConfig, addXsrfHeader)

app.mount('#savory-chrome-extension-app')
