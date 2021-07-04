import _ from 'lodash'
import { lookup } from './typeahead'

describe('lookup typeahead suggestions', () => {
  test('when there are no tags in state', () => {
    expect(lookup({}, 'sys')).toHaveLength(0)
  })

  test('prefix match', () => {
    let tags = {}
    tags['programming'] = 1
    expect(lookup(tags, 'sys')).toHaveLength(0)
    tags['systems'] = 1
    expect(lookup(tags, 'sys')).toEqual(['systems'])
    tags['systemd'] = 1
    expect(lookup(tags, 'sys')).toHaveLength(2)
    expect(lookup(tags, 'sys')).toEqual(
      expect.arrayContaining(['systems', 'systemd'])
    )
  })

  test('use frequency to break ties', () => {
    let tags = {}
    tags['systemd'] = 1
    tags['systems'] = 10
    expect(lookup(tags, 'sys')).toEqual(['systems', 'systemd'])
  })

  test('plucking out existing tags from suggestions', () => {
    let tags = {}
    tags['systemd'] = 1
    tags['systems'] = 10
    const bookmarkTags = ['programming', 'systems']
    let suggestions = lookup(tags, 'sys')
    expect(suggestions).toEqual(['systems', 'systemd'])
    _.pullAll(suggestions, bookmarkTags)
    expect(suggestions).toEqual(['systemd'])
  })
})
