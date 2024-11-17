import { queryOptions } from "@tanstack/react-query"
import { nextApp } from "./napi"
import { bookmarkSchema, tagsCountSchema } from "./schemas"

export function bookmarkQuery(bookmarkId: string) {
  return queryOptions({
    queryKey: ["bookmarks", bookmarkId],
    // This is a lie. This query is always disabled, therefore we never actually
    // fetch a single bookmark. Moreover, the next app doesn't even implement
    // the get bookmarks endpoint. We could stub this function but the types
    // must flow.
    queryFn: async () => {
      const response = await nextApp.get("bookmarks").json()
      return bookmarkSchema.parse(response)
    },
    enabled: false,
  })
}

export const tagsQuery = queryOptions({
  queryKey: ["tags"],
  queryFn: async () => {
    const response = await nextApp.get("tags").json()
    return tagsCountSchema.parse(response)
  },
  retry: 1,
  // Prevent tags query from being garbage collected. This query powers tags
  // autocomplete.
  //
  // Since this query is part of the `EditTags` component which is not always
  // mounted, these queries become "inactive" and by default are garbage
  // collected after 5 minutes. This is not great for user experience because
  // users will see a lag in autocomplete when opening the edit tags dialog
  // after 5 minutes.
  //
  // Setting this to Infinity means the tags cache sticks around and
  // autocomplete always works. Note that the query will be refreshed on
  // mounting the `EditTags` component.
  gcTime: Infinity,
})
