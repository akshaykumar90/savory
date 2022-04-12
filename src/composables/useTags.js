import { useQuery } from 'vue-query'

export function useTags() {
  const key = ['tags']
  return useQuery(key, async () => {
    let resp = await ApiClient.getTagsCount()
    return resp.data
  })
}
