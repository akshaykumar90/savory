import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"

import { useTRPC } from "./trpc"

function uniqueTagsPickLastOccurrence(tags: string[]) {
  const lastIndexMap = new Map<string, number>()

  // Store the last index of each tag.
  tags.forEach((tag, index) => {
    lastIndexMap.set(tag, index)
  })

  // Filter out any tag that is not the last occurrence.
  return tags.filter((tag, index) => lastIndexMap.get(tag) === index)
}

export default function useBookmarkTags(bookmarkIds: string[]) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const bookmarkTags = bookmarkIds
    .map((id) => {
      const bookmark = queryClient.getQueryData(
        trpc.bookmarks.get.queryKey({ id })
      )
      return bookmark?.tags ?? []
    })
    .flat()

  const tags = uniqueTagsPickLastOccurrence(bookmarkTags)

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

  const { mutate: addTag } = useMutation(
    trpc.tags.addTag.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: tagsQueryKey })
      },
      onMutate: ({ name: newTag }: { name: string }) => {
        let oldValues = []
        for (const id of bookmarkIds) {
          const queryKey = trpc.bookmarks.get.queryKey({ id })
          const bookmark = queryClient.getQueryData(queryKey)
          if (bookmark) {
            oldValues.push(bookmark)
            const updatedBookmark = {
              ...bookmark,
              tags: [...bookmark.tags, newTag],
            }
            queryClient.setQueryData(queryKey, updatedBookmark)
          }
        }
        return { oldValues }
      },
      onError: (err, newTag, context) => {
        context?.oldValues.forEach((oldValue) => {
          queryClient.setQueryData(
            trpc.bookmarks.get.queryKey({ id: oldValue.id }),
            oldValue
          )
        })
      },
    })
  )

  const { mutate: removeTag } = useMutation(
    trpc.tags.removeTag.mutationOptions({
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: tagsQueryKey })
      },
      onMutate: ({ name: tagToRemove }: { name: string }) => {
        let oldValues = []
        for (const id of bookmarkIds) {
          const queryKey = trpc.bookmarks.get.queryKey({ id })
          const bookmark = queryClient.getQueryData(queryKey)
          if (bookmark) {
            oldValues.push(bookmark)
            const updatedBookmark = {
              ...bookmark,
              tags: bookmark.tags.filter((t) => t !== tagToRemove),
            }
            queryClient.setQueryData(queryKey, updatedBookmark)
          }
        }
        return { oldValues }
      },
      onError: (err, newTag, context) => {
        context?.oldValues.forEach((oldValue) => {
          queryClient.setQueryData(
            trpc.bookmarks.get.queryKey({ id: oldValue.id }),
            oldValue
          )
        })
      },
    })
  )

  return {
    tags,
    allTags,
    addTag,
    removeTag,
  }
}
