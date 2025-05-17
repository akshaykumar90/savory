import { getSession } from "@/db/drizzle"
import { getTagsCount } from "@/db/queries/bookmark"
import { getUser } from "@/db/queries/user"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import ErrorScreen from "../error-screen"
import { RefreshOnFocus } from "../refresh-on-focus"
import TagFilter from "./tag-filter"

export const metadata: Metadata = {
  title: "Tags – Savory",
}

export default async function TagsPage() {
  const db = getSession()
  const user = await getUser(db)
  if (!user) {
    redirect("/landing")
  }
  let tagsResponse
  try {
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
