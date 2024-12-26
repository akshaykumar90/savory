import { AccessTokenError } from "@auth0/nextjs-auth0/errors"
import { Auth0Client } from "@auth0/nextjs-auth0/server"

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
    audience: "https://savory-next/api/v1",
  },
})

export function withApiAuthRequired(
  handler: (request: Request) => Promise<Response>
) {
  return async (request: Request): Promise<Response> => {
    try {
      return await handler(request)
    } catch (error) {
      if (error instanceof AccessTokenError) {
        return new Response(null, { status: 401 })
      }
      throw error
    }
  }
}
