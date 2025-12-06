import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
  },
  session: {
    rolling: false,
    absoluteDuration: 60 * 60 * 24 * 30, // 30 days
  },
  signInReturnToPath: "/login-callback",
})
