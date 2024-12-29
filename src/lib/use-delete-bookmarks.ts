import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { z } from "zod"
import { nextApp } from "./napi"
import { deleteBookmarksRequestSchema } from "./schemas"

type DeleteBookmarksRequest = z.infer<typeof deleteBookmarksRequestSchema>

export default function useDeleteBookmarks() {
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
