import { SessionNotFoundError } from "@/lib/auth0"
import { getTagsCount } from "@/lib/db/queries"
import { Metadata } from "next"
import { redirect } from "next/navigation"
import ErrorScreen from "../error-screen"
import { RefreshOnFocus } from "../refresh-on-focus"
import TagFilter from "./tag-filter"

export const metadata: Metadata = {
  title: "Tags – Savory",
}

export default async function TagsPage() {
  let tagsResponse
  try {
    tagsResponse = await getTagsCount()
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      redirect("/landing")
    }
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
