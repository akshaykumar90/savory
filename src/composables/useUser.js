import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'

export const USER_QUERY_KEY = ['user']

export function useUser() {
  return useQuery({
    queryKey: USER_QUERY_KEY,
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
      queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY })
    },
  })
}
