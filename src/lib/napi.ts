import ky from "ky"

const appBaseUrl = "https://app.savory.test:8080/api"

export const nextApp = ky.create({
  prefixUrl: appBaseUrl,
  retry: 0,
  timeout: 3000,
})
