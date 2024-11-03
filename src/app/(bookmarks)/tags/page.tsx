import * as bapi from "@/lib/bapi"
import TagFilter from "./tag-filter"
import { RefreshOnFocus } from "../refresh-on-focus"
import { Metadata } from "next"
import ErrorScreen from "../error-screen"
import { withPageAuthRequired } from "@auth0/nextjs-auth0"

export const metadata: Metadata = {
  title: "Tags – Savory",
}

export default withPageAuthRequired(
  async function TagsPage() {
    let tagsResponse
    try {
      tagsResponse = await bapi.getTagsCount()
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
  },
  { returnTo: "/tags" }
)
