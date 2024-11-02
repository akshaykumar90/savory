import * as bapi from "@/lib/bapi"
import TagFilter from "./tag-filter"
import { RefreshOnFocus } from "../refresh-on-focus"
import { Metadata } from "next"
import ErrorScreen from "../error-screen"

export const metadata: Metadata = {
  title: "Tags – Savory",
}

export default async function TagsPage() {
  let tagsResponse
  try {
    tagsResponse = await bapi.getTagsCount()
  } catch (error) {
    // TODO: If error is logout, redirect!
    return <ErrorScreen />
  }

  return (
    <div>
      <TagFilter tags={tagsResponse} />
      <RefreshOnFocus />
    </div>
  )
}
