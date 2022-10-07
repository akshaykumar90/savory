import { useQuery, useQueryClient } from '@tanstack/vue-query'

const TAGS_QUERY_KEY = ['tags']

const TAGS_QUERY_OPTIONS = {
  // Prevent `useTags` query from being garbage collected. This query powers
  // tags autocomplete.
  //
  // Since this query is part of the EditTags component which is not always
  // mounted, these queries become "inactive" and by default are garbage
  // collected after 5 minutes. This is not great for user experience
  // because users will see a lag in autocomplete when opening the edit tags
  // dialog after 5 minutes.
  //
  // Setting this to Infinity means the tags cache sticks around and
  // autocomplete always works. Note that the query will be refreshed on
  // mounting the EditTags component.
  cacheTime: Infinity,
}

async function tagsCount() {
  let resp = await ApiClient.getTagsCount()
  let result = {}
  for (const { name, count } of resp.data) {
    result[name] = count
  }
  return result
}

export function prefetchTags() {
  const queryClient = useQueryClient()
  queryClient.prefetchQuery(TAGS_QUERY_KEY, tagsCount, TAGS_QUERY_OPTIONS)
}

export function useTags() {
  return useQuery(TAGS_QUERY_KEY, tagsCount, TAGS_QUERY_OPTIONS)
}
