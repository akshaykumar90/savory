import { queryOptions } from "@tanstack/react-query"
import { getBookmark } from "./bapi"
import { nextApp } from "./napi"
import { tagsCountSchema } from "./schemas"

export function bookmarkQuery(bookmarkId: string) {
  return queryOptions({
    queryKey: ["bookmarks", bookmarkId],
    // This is a lie. This query is always disabled, therefore we never actually
    // fetch a single bookmark. We could stub this function but the types must
    // flow.
    queryFn: () => getBookmark({ id: bookmarkId }),
    enabled: false,
  })
}

export const tagsQuery = queryOptions({
  queryKey: ["tags"],
  queryFn: async () => {
    const response = await nextApp.get("tags").json()
    return tagsCountSchema.parse(response)
  },
})
