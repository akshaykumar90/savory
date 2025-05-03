import { queryOptions } from "@tanstack/react-query"
import { nextApp } from "./napi"
import { bookmarkSchema } from "./schemas"

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
