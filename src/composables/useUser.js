import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

const userQueryKey = ['user']

export function useUser() {
  return useQuery({
    queryKey: userQueryKey,
    queryFn: async () => {
      let resp = await ApiClient.loadUserData()
      return resp.data
    },
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ fullName }) => ApiClient.updateUser({ fullName }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userQueryKey })
    },
  })
}
