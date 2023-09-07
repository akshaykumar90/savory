import { tagsWithAccentBit, flattenTags } from './tagsRow'

describe('tags with accent bit', () => {
  test('empty', () => {
    expect(tagsWithAccentBit([], [])).toEqual([])
  })

  test('no page tags', () => {
    let tags = ['test']
    let expected = [{ name: 'test', accented: false }]
    expect(tagsWithAccentBit(tags, [])).toEqual(expected)
  })

  test('no tags but page tags present', () => {
    expect(tagsWithAccentBit([], ['how'])).toEqual([])
  })

  test('one page tag and total two tags', () => {
    let tags = ['hello', 'world']
    let page = ['world']
    let expected = [
      { name: 'world', accented: true },
      { name: 'hello', accented: false },
    ]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('one page tag with many tags', () => {
    let tags = ['econ', 'papers', 'google']
    let page = ['papers']
    let expected = [
      { name: 'papers', accented: true },
      { name: 'econ', accented: false },
      { name: 'google', accented: false },
    ]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('two page tags', () => {
    let tags = ['econ', 'papers', 'google']
    let page = ['econ', 'papers']
    let expected = [
      { name: 'econ', accented: true },
      { name: 'papers', accented: true },
      { name: 'google', accented: false },
    ]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('two page tags in reverse order', () => {
    let tags = ['econ', 'papers', 'google']
    let page = ['papers', 'econ']
    let expected = [
      { name: 'papers', accented: true },
      { name: 'econ', accented: true },
      { name: 'google', accented: false },
    ]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('single tag with page tag', () => {
    let tags = ['papers']
    let page = ['papers']
    let expected = [{ name: 'papers', accented: true }]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('single tag with no matching page tag', () => {
    let tags = ['papers']
    let page = ['nope']
    let expected = [{ name: 'papers', accented: false }]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('multiple tags fully consume page tags', () => {
    let tags = ['papers', 'love']
    let page = ['papers', 'love']
    let expected = [
      { name: 'papers', accented: true },
      { name: 'love', accented: true },
    ]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })

  test('multiple tags fully consume page tags, wrong order', () => {
    let tags = ['papers', 'love']
    let page = ['love', 'papers']
    let expected = [
      { name: 'love', accented: true },
      { name: 'papers', accented: true },
    ]
    expect(tagsWithAccentBit(tags, page)).toEqual(expected)
  })
})

describe('flatten tags', () => {
  test('empty', () => {
    expect(flattenTags([])).toEqual([])
  })

  test('one bookmark with tags', () => {
    expect(flattenTags([['hi']])).toEqual(['hi'])
  })

  test('one bookmark with multiple tags', () => {
    expect(flattenTags([['hi', 'there']])).toEqual(['hi', 'there'])
  })

  test.skip('one bookmark with multiple tags no alphabetical sort', () => {
    expect(flattenTags([['los', 'angeles']])).toEqual(['los', 'angeles'])
  })

  test('two bookmarks same tags', () => {
    expect(flattenTags([['book'], ['book']])).toEqual(['book'])
  })

  test('two bookmarks unique tags', () => {
    expect(flattenTags([['hello'], ['world']])).toEqual(['hello', 'world'])
  })

  test.skip('two bookmarks many tags', () => {
    expect(flattenTags([['hello', 'cruel'], ['world']])).toEqual([
      'hello',
      'cruel',
      'world',
    ])
  })

  test.skip('two bookmarks bulk add tag', () => {
    expect(
      flattenTags([
        ['europe', 'travel'],
        ['united states', 'travel'],
      ])
    ).toEqual(['europe', 'united states', 'travel'])
  })
})
