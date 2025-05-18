import { getSession } from "@/db/drizzle"
import { getTagsCount } from "@/db/queries/bookmark"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import ErrorScreen from "../error-screen"
import { RefreshOnFocus } from "../refresh-on-focus"
import TagFilter from "./tag-filter"
import { getUser } from "@/db/queries/user"

export const metadata: Metadata = {
  title: "Tags – Savory",
}

export default async function TagsPage() {
  const user = await getUser()
  if (!user) {
    redirect("/landing")
  }
  let tagsResponse
  try {
    const db = await getSession()
    tagsResponse = await getTagsCount(db, user.id)
  } catch (error) {
    const wrappedError =
      error instanceof Error ? error : new Error(JSON.stringify(error))
    return <ErrorScreen error={wrappedError} />
  }

  return (
    <div>
      <TagFilter tags={tagsResponse} />
      <RefreshOnFocus />
    </div>
  )
}
