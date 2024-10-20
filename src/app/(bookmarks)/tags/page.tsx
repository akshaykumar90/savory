import * as bapi from "@/lib/bapi"
import TagFilter from "./tag-filter"
import { RefreshOnFocus } from "../refresh-on-focus"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Tags – Savory",
}

// TODO: This is being cached!?
export default async function TagsPage() {
  const tagsResponse = await bapi.getTagsCount()

  return (
    <div>
      <TagFilter tags={tagsResponse} />
      <RefreshOnFocus />
    </div>
  )
}
