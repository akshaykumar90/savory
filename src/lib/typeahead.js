const caseSensitiveTags = false

export function lookup(tags, query) {
  const searchQuery = caseSensitiveTags ? query : query.toLowerCase()

  let searchResults = []

  for (const [tag, freq] of Object.entries(tags)) {
    const candidate = caseSensitiveTags ? tag : tag.toLowerCase()
    if (candidate.startsWith(searchQuery)) {
      searchResults.push([tag, freq])
    }
  }

  // Sort the search results by decreasing tag frequency
  searchResults.sort(([, freq1], [, freq2]) => {
    return -(freq1 - freq2)
  })

  return searchResults.map(([tag]) => tag)
}
