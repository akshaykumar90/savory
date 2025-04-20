import { getUser } from "@/lib/db/queries"
import { AccessTokenError } from "@auth0/nextjs-auth0/errors"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import EditProfile from "./edit-profile"

export const metadata: Metadata = {
  title: "Settings – Savory",
}

export default async function SettingsPage() {
  let user
  try {
    user = await getUser()
  } catch (error) {
    if (error instanceof AccessTokenError) {
      redirect("/landing")
    }
    return (
      <p className="p-4">
        There was an error loading user settings. Please retry.
      </p>
    )
  }

  return (
    <>
      <div className="mx-auto mt-4 max-w-xl px-4 sm:mt-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
          Settings
        </h1>
      </div>
      <main className="my-4 sm:my-10">
        <div className="mx-auto max-w-xl space-y-4 px-4 sm:space-y-10 sm:px-6 lg:px-8">
          <div className="rounded-lg border px-4 py-8 sm:px-6 lg:px-8">
            <EditProfile
              userCreatedAt={user.createdAt}
              fullName={user.fullName}
              email={user.email}
            />
          </div>
        </div>
      </main>
    </>
  )
}
