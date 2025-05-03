import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import { z } from "zod"

import { nextApp } from "./napi"
import { bookmarkQuery } from "./queries"
import { tagsRequestSchema } from "./schemas"
import { useTRPC } from "./trpc"

type TagsRequest = z.infer<typeof tagsRequestSchema>

export default function useBookmarkTags(bookmarkIds: string[]) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const tags = useQueries({
    queries: bookmarkIds.map(bookmarkQuery),
    combine: uniqueTags,
  })

  const { data: allTags } = useQuery(
    trpc.tags.getTagsCount.queryOptions(undefined, {
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
  )

  const tagsQueryKey = trpc.tags.getTagsCount.queryKey()

  const { mutate: addTag } = useMutation({
    mutationFn: async (newTag: string) => {
      const body: TagsRequest = {
        bookmarkIds,
        name: newTag,
      }
      await nextApp.post("tags", { json: body })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: tagsQueryKey })
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
      queryClient.invalidateQueries({ queryKey: tagsQueryKey })
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
