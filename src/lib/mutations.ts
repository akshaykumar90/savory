import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { bookmarkQuery, tagsQuery } from "./queries"
import { z } from "zod"
import {
  bookmarkSchema,
  deleteBookmarksRequestSchema,
  tagsRequestSchema,
} from "./schemas"
import { nextApp } from "./napi"
import { TimeoutError } from "ky"

type TagsRequest = z.infer<typeof tagsRequestSchema>
type DeleteBookmarksRequest = z.infer<typeof deleteBookmarksRequestSchema>

export function useDeleteBookmarks() {
  const queryClient = useQueryClient()
  const router = useRouter()

  return useMutation({
    mutationFn: async (bookmarkIds: string[]) => {
      const body: DeleteBookmarksRequest = {
        bookmarkIds,
      }
      await nextApp.delete("bookmarks", {
        json: body,
      })
    },
    onMutate: (bookmarkIds: string[]) => {
      // optimistic update
      bookmarkIds.forEach((id) => {
        queryClient.setQueryData(["bookmarks", id], null)
      })
    },
    onSuccess: () => {
      router.refresh()
    },
  })
}

export function useNewBookmark() {
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

export function useBookmarkTags(bookmarkIds: string[]) {
  const queryClient = useQueryClient()

  const tags = useQueries({
    queries: bookmarkIds.map(bookmarkQuery),
    combine: uniqueTags,
  })

  const { data: allTags } = useQuery(tagsQuery)

  const { mutate: addTag } = useMutation({
    mutationFn: async (newTag: string) => {
      const body: TagsRequest = {
        bookmarkIds,
        name: newTag,
      }
      await nextApp.post("tags", { json: body })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsQuery.queryKey })
    },
    onMutate: (newTag: string) => {
      let oldValues = []
      for (const id of bookmarkIds) {
        const queryOptions = bookmarkQuery(id)
        const bookmark = queryClient.getQueryData(queryOptions.queryKey)
        if (bookmark) {
          oldValues.push(bookmark)
          const updatedBookmark = {
            ...bookmark,
            tags: [...bookmark.tags, newTag],
          }
          queryClient.setQueryData(queryOptions.queryKey, updatedBookmark)
        }
      }
      return { oldValues }
    },
    onError: (err, newTag, context) => {
      context?.oldValues.forEach((oldValue) => {
        const queryOptions = bookmarkQuery(oldValue.id)
        queryClient.setQueryData(queryOptions.queryKey, oldValue)
      })
    },
  })

  const { mutate: removeTag } = useMutation({
    mutationFn: async (tagName: string) => {
      const body: TagsRequest = {
        bookmarkIds,
        name: tagName,
      }
      await nextApp.delete("tags", {
        json: body,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsQuery.queryKey })
    },
    onMutate: (tagToRemove: string) => {
      let oldValues = []
      for (const id of bookmarkIds) {
        const queryOptions = bookmarkQuery(id)
        const bookmark = queryClient.getQueryData(queryOptions.queryKey)
        if (bookmark) {
          oldValues.push(bookmark)
          const updatedBookmark = {
            ...bookmark,
            tags: bookmark.tags.filter((t) => t !== tagToRemove),
          }
          queryClient.setQueryData(queryOptions.queryKey, updatedBookmark)
        }
      }
      return { oldValues }
    },
    onError: (err, newTag, context) => {
      context?.oldValues.forEach((oldValue) => {
        const queryOptions = bookmarkQuery(oldValue.id)
        queryClient.setQueryData(queryOptions.queryKey, oldValue)
      })
    },
  })

  return {
    tags,
    allTags,
    addTag,
    removeTag,
  }
}

/// Helpers

function uniqueTags(results: Array<UseQueryResult<{ tags: string[] }>>) {
  const tags = results
    .map((result) => (result.isSuccess ? result.data.tags : []))
    .flat()

  const lastIndexMap = new Map<string, number>()

  // Store the last index of each tag.
  tags.forEach((tag, index) => {
    lastIndexMap.set(tag, index)
  })

  // Filter out any tag that is not the last occurrence.
  return tags.filter((tag, index) => lastIndexMap.get(tag) === index)
}
