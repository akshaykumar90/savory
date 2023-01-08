import { useMutation } from '@tanstack/vue-query'

export function usePocketImport() {
  return useMutation({
    mutationFn: () => ApiClient.connectPocket(),
  })
}
