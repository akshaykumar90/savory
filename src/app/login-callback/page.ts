import { db } from "@/db/drizzle"
import { createBookmark } from "@/db/queries/bookmark"
import { createOrUpdateUser } from "@/db/queries/user"
import { auth0 } from "@/lib/auth0"
import { redirect } from "next/navigation"

function getOnboardingBookmarks() {
  const now = new Date()
  return [
    {
      title: "Welcome to Savory - read me first!",
      url: `${process.env.NEXT_PUBLIC_MKT_SITE_URL}/getting-started`,
      tags: ["savory", "reading"],
      dateAdded: now,
    },
    {
      title: "Install the browser extension",
      url: `${process.env.NEXT_PUBLIC_MKT_SITE_URL}/extension`,
      tags: ["todo", "savory"],
      dateAdded: new Date(now.getTime() - 1000), // 1 second ago
    },
    {
      title: "Contact the Savory team - we would love to hear from you.",
      url: `${process.env.NEXT_PUBLIC_MKT_SITE_URL}/feedback`,
      tags: ["help", "savory"],
      dateAdded: new Date(now.getTime() - 2000), // 2 seconds ago
    },
  ]
}

export default async function LoginCallback() {
  const session = await auth0.getSession()
  if (!session) {
    redirect("/landing")
  }

  const { isNewUser, userId } = await createOrUpdateUser(db, {
    auth0Sub: session.user.sub,
    email: session.user.email,
    isEmailVerified: session.user.email_verified,
  })

  if (isNewUser) {
    for (const bookmark of getOnboardingBookmarks()) {
      await createBookmark(db, userId, bookmark)
    }
  }

  redirect("/")
}
