import { Metadata } from "next"
import EditProfile from "./edit-profile"
import * as bapi from "@/lib/bapi"

export const metadata: Metadata = {
  title: "Settings – Savory",
}

export default async function SettingsPage() {
  const user = await bapi.loadUserData()

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
