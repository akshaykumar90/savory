/**
 * @vitest-environment jsdom
 */
import { render } from '@testing-library/vue'
import TagButton from './TagButton.vue'

describe('tag button is rendered', () => {
  test('base button', () => {
    const { getByRole, debug } = render(TagButton, {
      props: { name: 'first tag' },
    })
    const button = getByRole('button')
    expect(button.classList.contains('bg-indigo-100')).toBeTruthy()
  })

  test('accent button', () => {
    const { getByRole, debug } = render(TagButton, {
      props: { name: 'first tag', accented: true },
    })
    const button = getByRole('button')
    expect(button.classList.contains('bg-pink-100')).toBeTruthy()
  })

  test('base button with remove icon', () => {
    const { getByRole, debug } = render(TagButton, {
      props: { name: 'first tag', showRemove: true },
    })
    const button = getByRole('button')
    expect(button.lastChild.classList.contains('text-indigo-400')).toBeTruthy()
  })

  test('accent button with remove icon', () => {
    const { getByRole, debug } = render(TagButton, {
      props: { name: 'first tag', accented: true, showRemove: true },
    })
    const button = getByRole('button')
    expect(button.lastChild.classList.contains('text-pink-400')).toBeTruthy()
  })
})
