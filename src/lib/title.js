export function windowTitle(pageState) {
  const baseTitle = 'Savory'

  const hasFilters = pageState.site || (pageState.tags && pageState.tags.length)
  let filtersString
  if (hasFilters) {
    let all_filters = []
    if (pageState.site) {
      all_filters.push(pageState.site)
    }
    if (pageState.tags && pageState.tags.length) {
      all_filters.push(...pageState.tags)
    }
    // Create a quoted, comma-separated string with all filters
    filtersString = all_filters.map((x) => '“' + x + '”').join(', ')
  }

  const hasSearchQuery = !!pageState.search
  const searchPrefix =
    hasSearchQuery && `Search results for “${pageState.search}”`

  let titleArray = []
  if (hasSearchQuery) {
    titleArray.push(searchPrefix)
  }
  if (hasFilters) {
    titleArray.push(filtersString)
  }

  const titlePrefix = titleArray.join(' in ')
  if (titlePrefix) {
    return `${titlePrefix} – ${baseTitle}`
  } else {
    return baseTitle
  }
}
