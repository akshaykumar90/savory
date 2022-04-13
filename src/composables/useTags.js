import { useQuery } from 'vue-query'

export function useTags() {
  const key = ['tags']
  return useQuery(key, async () => {
    let resp = await ApiClient.getTagsCount()
    let result = {}
    for (const { name, count } of resp.data) {
      result[name] = count
    }
    return result
  })
}
