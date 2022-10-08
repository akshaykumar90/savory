export function tagsWithAccentBit(allTags, pageTags) {
  let result = allTags
    .filter((t) => pageTags.includes(t))
    .map((t) => ({ name: t, accented: true }))
  result = result.concat(
    allTags
      .filter((t) => !pageTags.includes(t))
      .map((t) => ({ name: t, accented: false }))
  )
  return result
}
