<template>
  <header>
    <div class="h-16"></div>
    <div class="fixed top-0 z-10 h-16 w-full">
      <AppHeader />
    </div>
    <div class="mx-auto my-10 max-w-xl px-4 sm:px-6 lg:px-8">
      <h1 class="text-3xl font-bold leading-tight tracking-tight text-gray-900">
        Settings
      </h1>
    </div>
  </header>
  <main v-if="isSuccess">
    <div class="mx-auto max-w-xl space-y-10 px-4 sm:px-6 lg:px-8">
      <div class="rounded-lg border px-4 py-8 sm:px-6 lg:px-8">
        <EditUserProfile
          :name="data.full_name"
          :email="data.email"
          :created-at="data.created_at"
        />
      </div>
      <div class="rounded-lg border px-4 py-8 sm:px-6 lg:px-8">
        <ConnectedApps />
      </div>
    </div>
  </main>
</template>

<script setup>
import AppHeader from '../components/AppHeader.vue'
import { useUser } from '../composables/useUser'
import EditUserProfile from '../components/EditUserProfile.vue'
import ConnectedApps from '../components/ConnectedApps.vue'

const { isSuccess, data } = useUser()
</script>
