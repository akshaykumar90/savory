import _ from 'lodash'

export function tagsWithAccentBit(allTags, pageTags) {
  // Cannot use pullAll here because allTags will actually be a proxy, and it
  // cannot be mutated.
  const tagsExcluded = _.difference(allTags, pageTags)
  let result = pageTags.map((t) => ({ name: t, accented: true }))
  result = result.concat(
    tagsExcluded.map((t) => ({ name: t, accented: false }))
  )
  return result
}
