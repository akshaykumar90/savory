import { useMutation, useQueryClient } from "@tanstack/react-query"
import { bookmarkSchema } from "./schemas"
import { nextApp } from "./napi"
import { bookmarkQuery } from "./queries"
import { TimeoutError } from "ky"

export default function useNewBookmark() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (tab: {
      title: string
      url: string
      dateAddedMs: number
    }) => {
      const response = await nextApp.post("bookmarks", { json: tab }).json()
      return bookmarkSchema.parse(response)
    },
    onSuccess: (bookmark) => {
      const queryOptions = bookmarkQuery(bookmark.id)
      queryClient.setQueryData(queryOptions.queryKey, bookmark)
    },
    retry: (failureCount, error) => {
      if (error instanceof TimeoutError) {
        // Upto 3 retry attempts (i.e. 4 attempts total) in case of timeouts
        return failureCount < 3
      }
      return false
    },
    // Exponential backoff delay, starting with 500ms
    retryDelay: (failureCount) =>
      ~~((Math.random() + 0.5) * (1 << Math.min(failureCount, 8))) * 500,
  })
}
