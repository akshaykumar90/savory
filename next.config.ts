import type { NextConfig } from "next"

const nextConfig: NextConfig = {}

if (process.env.NODE_ENV === "development") {
  // require() inside the guard so this never even loads in prod
  // (and doesn’t trigger Hyperdrive emulation)
  const { initOpenNextCloudflareForDev } = require("@opennextjs/cloudflare")
  initOpenNextCloudflareForDev()
}

export default nextConfig
