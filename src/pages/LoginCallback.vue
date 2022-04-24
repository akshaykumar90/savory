<script setup>
import { EVENT_SIGNUP_SUCCESS, eventLogger } from '../api/events'
import { onMounted, ref } from 'vue'
import { useAuth } from '../auth'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'

const error = ref(null)

const authStore = useAuth()

const { redirectCallback } = authStore

const { isAuthenticated } = storeToRefs(authStore)

const router = useRouter()

onMounted(async () => {
  await redirectCallback()

  if (!isAuthenticated.value) {
    error.value = 'Login error. Could not authenticate.'
    return
  }

  let resp = await ApiClient.loadUserData()
  const { login_count } = resp.data
  if (login_count === 1) {
    // We provide `/provider_cb` as the success callback to Auth0 which
    // is handled by this component. If this is the first login for this
    // user, this must be a successful signup event.
    eventLogger.logEvent(EVENT_SIGNUP_SUCCESS)
  }
  router.replace('/')
})
</script>

<template>
  <div class="p-4" v-if="error">
    <h2 class="mb-2">{{ error }}</h2>
    <router-link to="/" class="text-blue-500 underline"
      >Go back home</router-link
    >
  </div>
</template>
