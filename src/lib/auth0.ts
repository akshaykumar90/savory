import { getSession } from "@/db/drizzle"
import { users } from "@/db/schema"
import { Auth0Client } from "@auth0/nextjs-auth0/server"
import { eq } from "drizzle-orm"

export const auth0 = new Auth0Client({
  authorizationParameters: {
    scope: "openid profile email",
    audience: process.env.AUTH0_AUDIENCE,
  },
  session: {
    rolling: false,
    absoluteDuration: 60 * 60 * 24 * 30, // 30 days
  },
  signInReturnToPath: "/login-callback",
})

export async function getUser() {
  const session = await auth0.getSession()
  if (!session) {
    return null
  }
  const subject = session.user.sub

  const db = await getSession()
  const result = await db
    .select()
    .from(users)
    .where(eq(users.auth0Sub, subject))
    .limit(1)

  if (result.length === 0) {
    return null
  }

  const user = result[0]
  if (!user.isActive) {
    return null
  }

  return user
}
