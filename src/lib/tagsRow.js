export function tagsWithAccentBit(allTags, pageTags) {
  let result = pageTags
    .filter((t) => allTags.includes(t))
    .map((t) => ({ name: t, accented: true }))
  result = result.concat(
    allTags
      .filter((t) => !pageTags.includes(t))
      .map((t) => ({ name: t, accented: false }))
  )
  return result
}

export function flattenTags(tagsList) {
  let allTags = []
  for (let tags of tagsList) {
    allTags = allTags.concat(tags)
  }
  let result = Array.from(new Set(allTags))
  return result.sort()
}
