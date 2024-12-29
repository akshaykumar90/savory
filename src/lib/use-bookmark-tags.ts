import {
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query"
import { z } from "zod"

import { nextApp } from "./napi"
import { bookmarkQuery, tagsQuery } from "./queries"
import { tagsRequestSchema } from "./schemas"

type TagsRequest = z.infer<typeof tagsRequestSchema>

export default function useBookmarkTags(bookmarkIds: string[]) {
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
