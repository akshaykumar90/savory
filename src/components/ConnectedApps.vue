<template>
  <div>
    <h3 class="text-lg font-medium leading-6 text-gray-900">Integrations</h3>
  </div>
  <ul role="list" class="mt-6 divide-y divide-gray-200">
    <li v-for="app in allApps" :key="app.name" class="py-4">
      <div class="space-y-2">
        <span
          v-if="app.successDate.value"
          class="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-800"
        >
          Last synced on {{ app.successDate.value }}
        </span>
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
              :disabled="app.buttonDisabled.value"
              class="inline-flex items-center justify-center rounded-full bg-slate-900 py-1.5 px-3 text-sm font-medium text-white hover:bg-slate-700 hover:text-slate-100 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 active:bg-slate-800 active:text-slate-300 disabled:pointer-events-none disabled:opacity-50"
              @click="app.buttonAction"
            >
              {{ app.buttonText.value }}
            </button>
          </div>
        </div>
        <p class="text-sm text-red-600" v-if="app.error.value">
          {{ app.error.value }}
        </p>
      </div>
    </li>
  </ul>
</template>

<script>
import pocketLogo from '../assets/images/pocket_logo.png'
import {
  useConnectPocket,
  useDisconnectPocket,
} from '../composables/useIntegrations'
import { useUser } from '../composables/useUser'
import { computed } from 'vue'

const dateFormatOpts = { year: 'numeric', month: 'short', day: 'numeric' }

const redirectUri = `${process.env.SAVORY_APP_URL}/pocket_callback`
const pocketAuthBaseUrl = `${process.env.POCKET_API_URL}/auth/authorize`

const getPocketAuthUrl = (requestToken) =>
  `${pocketAuthBaseUrl}?request_token=${requestToken}&redirect_uri=${redirectUri}`

export default {
  setup() {
    const { data } = useUser()

    const {
      isLoading: isPocketConnectLoading,
      isError: isPocketConnectError,
      mutate: connectPocket,
    } = useConnectPocket()

    const { isLoading: isPocketDisconnectLoading, mutate: disconnectPocket } =
      useDisconnectPocket()

    const pocketStatus = computed(() => {
      return data.value && data.value.pocket_status
    })

    const pocketSyncedAt = computed(
      () => pocketStatus.value === 'connected' && data.value.pocket_synced_at
    )

    const pocketSuccessDate = computed(() => {
      return (
        pocketSyncedAt.value &&
        new Date(pocketSyncedAt.value).toLocaleDateString(
          undefined,
          dateFormatOpts
        )
      )
    })

    const pocketButtonDisabled = computed(() => {
      return isPocketConnectLoading.value || isPocketDisconnectLoading.value
    })

    const pocketButtonText = computed(() => {
      if (!pocketStatus.value) {
        return 'Connect'
      }

      // Status is either "error" or "connected"
      return 'Disconnect'
    })

    const pocketErrorString = computed(() => {
      if (isPocketConnectError.value) {
        return 'There was an error. Try again in some time.'
      }

      if (pocketStatus.value === 'error') {
        return 'There was an error during syncing. Disconnect and connect again.'
      }

      return ''
    })

    function onPocketImportClicked() {
      if (!pocketStatus.value) {
        connectPocket(undefined, {
          onSuccess: (resp) => {
            const { token } = resp.data
            const windowUrl = getPocketAuthUrl(token)
            window.open(windowUrl, 'pocket', 'popup=yes,width=1200,height=1000')
          },
        })
      } else {
        disconnectPocket()
      }
    }

    const allApps = [
      {
        name: 'Pocket',
        description: 'Import articles from Pocket',
        logoUrl: pocketLogo,
        buttonText: pocketButtonText,
        buttonAction: onPocketImportClicked,
        buttonDisabled: pocketButtonDisabled,
        error: pocketErrorString,
        successDate: pocketSuccessDate,
      },
    ]

    return {
      allApps,
    }
  },
}
</script>
