<template>
  <div>
    <h3 class="text-lg font-medium leading-6 text-gray-900">Integrations</h3>
  </div>
  <ul role="list" class="mt-6 divide-y divide-gray-200">
    <li v-for="app in allApps" :key="app.name" class="py-4">
      <div class="flex items-center space-x-4">
        <div
          class="h-11 w-11 flex-shrink-0 overflow-hidden rounded-lg border shadow-md"
        >
          <img :src="app.logoUrl" alt="" />
        </div>
        <div class="min-w-0 flex-1">
          <p class="truncate text-sm font-medium text-gray-900">
            {{ app.name }}
          </p>
          <p class="truncate text-sm text-gray-500">{{ app.description }}</p>
        </div>
        <div>
          <button
            class="inline-flex items-center justify-center rounded-full bg-slate-900 py-1.5 px-3 text-sm font-medium text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300"
          >
            {{ app.buttonText }}
          </button>
        </div>
      </div>
    </li>
  </ul>
</template>

<script setup>
import pocketLogo from '../assets/images/pocket_logo.png'

const allApps = [
  {
    name: 'Pocket',
    description: 'Import articles from Pocket',
    logoUrl: pocketLogo,
    buttonText: 'Import',
  },
]
</script>
