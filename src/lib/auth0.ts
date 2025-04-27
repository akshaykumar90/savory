import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
    audience: process.env.AUTH0_AUDIENCE,
  },
  session: {
    rolling: false,
    absoluteDuration: 60 * 60 * 24 * 30, // 30 days
  },
})

export class SessionNotFoundError extends Error {
  constructor(message = "No active session found") {
    super(message)
    this.name = "SessionNotFoundError"
  }
}

export function withApiAuthRequired(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error) {
      if (error instanceof SessionNotFoundError) {
        return new Response(null, { status: 401 })
      }
      throw error
    }
  }
}
