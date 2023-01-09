import { useMutation, useQueryClient } from '@tanstack/vue-query'
import { USER_QUERY_KEY } from './useUser'

export function useConnectPocket() {
  return useMutation({
    mutationFn: () => ApiClient.connectPocket(),
  })
}

export function useDisconnectPocket() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => ApiClient.disconnectPocket(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}
