import { createApp, watch } from 'vue'
import { createPinia, storeToRefs } from 'pinia'

import App from './App.vue'
import { getRouter } from './router'
import { useAuth } from './auth'
import { eventLogger } from './api/events'
import { clientConfig } from './api/backend'
import { Client } from './api/backend/client'
import { VueQueryPlugin } from '@tanstack/vue-query'

eventLogger.init(process.env.AMPLITUDE_API_KEY)

const app = createApp(App)

app.use(createPinia())

const authStore = useAuth()

const router = getRouter()

window.router = router

app.use(router)

app.use(VueQueryPlugin)

const { isAuthenticated, tokenExpiredBeacon } = storeToRefs(authStore)

// This cannot happen from within authClient since it is shared by the user-facing
// app and the background extension. This is a no-op in the background
// extension since it cannot prompt the user to log back in (yet). It will
// just become useless and print error messages in the console.
watch(
  () => tokenExpiredBeacon.value,
  (beacon) => {
    if (beacon) {
      authStore.logout()
    }
  }
)

watch(
  () => isAuthenticated.value,
  (isAuthenticated) => {
    if (isAuthenticated) {
      eventLogger.setUserId(authStore.getUserId())
    } else {
      eventLogger.setUserId(null)
    }
  },
  { immediate: true }
)

window.ApiClient = new Client(authStore, clientConfig)

app.mount('#app')
