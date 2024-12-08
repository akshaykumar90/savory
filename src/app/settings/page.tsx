import { Metadata } from "next"
import EditProfile from "./edit-profile"
import * as bapi from "@/lib/bapi"

export const metadata: Metadata = {
  title: "Settings – Savory",
}

export default async function SettingsPage() {
  let user
  try {
    user = await bapi.loadUserData()
  } catch (error) {
    return (
      <p className="p-4">
        There was an error loading user settings. Please retry.
      </p>
    )
  }

  return (
    <main className="my-4 sm:my-10">
      <div className="mx-auto max-w-xl space-y-4 px-4 sm:space-y-10 sm:px-6 lg:px-8">
        <div className="rounded-lg border px-4 py-8 sm:px-6 lg:px-8">
          <EditProfile
            userCreatedAt={new Date(user.created_at)}
            fullName={user.full_name}
            email={user.email}
          />
        </div>
      </div>
    </main>
  )
}
