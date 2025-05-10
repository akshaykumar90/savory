import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "./trpc"

export default function useNewBookmark() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const mutationOptions = trpc.bookmarks.create.mutationOptions({
    onSuccess: (bookmark) => {
      queryClient.setQueryData(
        trpc.bookmarks.get.queryKey({ id: bookmark.id }),
        bookmark
      )
    },
    retry: (failureCount, error) => {
      const httpStatus = error.data?.httpStatus
      if (httpStatus && [502, 503, 504].includes(httpStatus)) {
        // Upto 3 retry attempts (i.e. 4 attempts total) in case of timeouts
        return failureCount < 3
      }
      return false
    },
    // Exponential backoff delay, starting with 500ms
    retryDelay: (failureCount) =>
      ~~((Math.random() + 0.5) * (1 << Math.min(failureCount, 8))) * 500,
  })

  return useMutation(mutationOptions)
}
