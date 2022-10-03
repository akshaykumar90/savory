import { windowTitle } from './title'

describe('window title for bookmark pages', () => {
  test('app home load', () => {
    expect(windowTitle({})).toBe('Savory')
  })

  test('single tag page', () => {
    expect(windowTitle({ tags: ['systems'] })).toBe('“systems” – Savory')
  })

  test('multiple tags', () => {
    expect(windowTitle({ tags: ['systems', 'reference'] })).toBe(
      '“systems”, “reference” – Savory'
    )
  })

  test('site tag page', () => {
    expect(windowTitle({ site: ['twitter.com'] })).toBe(
      '“twitter.com” – Savory'
    )
  })

  test('site with tags tag page', () => {
    expect(windowTitle({ site: ['twitter.com'], tags: ['video'] })).toBe(
      '“twitter.com”, “video” – Savory'
    )
  })

  test('site with two tags tag page', () => {
    expect(
      windowTitle({ site: ['twitter.com'], tags: ['video', 'tools'] })
    ).toBe('“twitter.com”, “video”, “tools” – Savory')
  })

  test('just search', () => {
    expect(windowTitle({ search: 'san francisco' })).toBe(
      'Search results for “san francisco” – Savory'
    )
  })

  test('search in single tag page', () => {
    expect(windowTitle({ tags: ['food'], search: 'san francisco' })).toBe(
      'Search results for “san francisco” in “food” – Savory'
    )
  })

  test('search in multiple tags', () => {
    expect(
      windowTitle({ tags: ['systems', 'reference'], search: 'san francisco' })
    ).toBe(
      'Search results for “san francisco” in “systems”, “reference” – Savory'
    )
  })

  test('search in site tag page', () => {
    expect(
      windowTitle({ site: ['twitter.com'], search: 'san francisco' })
    ).toBe('Search results for “san francisco” in “twitter.com” – Savory')
  })

  test('search in site with tags tag page', () => {
    expect(
      windowTitle({
        site: ['twitter.com'],
        tags: ['video'],
        search: 'san francisco',
      })
    ).toBe(
      'Search results for “san francisco” in “twitter.com”, “video” – Savory'
    )
  })

  test('Search in site with two tags tag page', () => {
    expect(
      windowTitle({
        site: ['twitter.com'],
        tags: ['video', 'tools'],
        search: 'san francisco',
      })
    ).toBe(
      'Search results for “san francisco” in “twitter.com”, “video”, “tools” – Savory'
    )
  })
})
