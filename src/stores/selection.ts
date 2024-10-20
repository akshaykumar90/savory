import { atom } from "jotai"
import { atomWithReset } from "jotai/utils"

export const selectedBookmarkIdsAtom = atomWithReset<Set<string>>(new Set([]))

export const addToSelectionAtom = atom(null, (get, set, update: string) => {
  set(selectedBookmarkIdsAtom, (prev) => new Set([...prev, update]))
})

export const removeFromSelectionAtom = atom(
  null,
  (get, set, bookmarkId: string) => {
    set(
      selectedBookmarkIdsAtom,
      (prev) => new Set([...prev].filter((x) => x !== bookmarkId))
    )
  }
)

export const removeMultipleFromSelectionAtom = atom(
  null,
  (get, set, bookmarkIds: string[]) => {
    set(
      selectedBookmarkIdsAtom,
      (prev) => new Set([...prev].filter((x) => !bookmarkIds.includes(x)))
    )
  }
)
