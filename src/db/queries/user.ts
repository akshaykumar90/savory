import { and, count, eq, inArray } from "drizzle-orm"
import { getSession, type Session } from "../drizzle"
import { bookmarks, users } from "../schema"
import { auth0 } from "@/lib/auth0"

// IMPORTANT: This function should not take a db session as a parameter. We want
// the `getSession` call to happen before we setup a database session, to make
// any route calling this function opt-into dynamic rendering. If the db session
// is created before, the build will fail due to a Hyperdrive configuration
// error.
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

export async function userHasAccess(
  db: Session,
  userId: string,
  bookmarkIds: string[]
) {
  const result = await db
    .select({ count: count() })
    .from(bookmarks)
    .where(
      and(eq(bookmarks.ownerId, userId), inArray(bookmarks.id, bookmarkIds))
    )

  if (result.length === 0) {
    return false
  }

  return result[0].count === bookmarkIds.length
}

export async function createOrUpdateUser(
  db: Session,
  args: {
    auth0Sub: string
    email?: string
    isEmailVerified?: boolean
  }
): Promise<{ userId: string; isNewUser: boolean }> {
  const { auth0Sub, email, isEmailVerified } = args
  return await db.transaction(async (tx) => {
    const result = await tx
      .select()
      .from(users)
      .where(eq(users.auth0Sub, auth0Sub))
      .limit(1)

    const isNewUser = result.length === 0

    let userId: string

    if (isNewUser) {
      userId = crypto.randomUUID()
      await tx.insert(users).values({
        id: userId,
        auth0Sub,
        email,
        isEmailVerified,
      })
    } else {
      userId = result[0].id
      const loginCount = result[0].loginCount ?? 0
      const now = new Date()
      await tx
        .update(users)
        .set({
          email,
          isEmailVerified,
          lastLogin: now,
          loginCount: loginCount + 1,
        })
        .where(eq(users.auth0Sub, auth0Sub))
    }

    return { userId, isNewUser }
  })
}

export async function updateUser(
  db: Session,
  userId: string,
  fullName: string
) {
  await db.update(users).set({ fullName }).where(eq(users.id, userId))
}
