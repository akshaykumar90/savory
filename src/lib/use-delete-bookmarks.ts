import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { useTRPC } from "./trpc"

export default function useDeleteBookmarks() {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const router = useRouter()

  const mutationOptions = trpc.bookmarks.delete.mutationOptions({
    onMutate: ({ bookmarkIds }: { bookmarkIds: string[] }) => {
      // optimistic update
      bookmarkIds.forEach((id) => {
        queryClient.setQueryData(trpc.bookmarks.get.queryKey({ id }), null)
      })
    },
    onSuccess: () => {
      router.refresh()
    },
  })

  return useMutation(mutationOptions)
}
