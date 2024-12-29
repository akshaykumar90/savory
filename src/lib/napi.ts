import ky from "ky"

let appBaseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL
if (!appBaseUrl) {
  // we must be in the extension
  appBaseUrl = import.meta.env.VITE_APP_BASE_URL
}

const prefixUrl = `${appBaseUrl}/api`

export const nextApp = ky.create({
  prefixUrl,
  retry: 0,
  timeout: 3000,
})
