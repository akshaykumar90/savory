import { atomWithReset } from "jotai/utils"

export const bookmarksToDeleteAtom = atomWithReset<Array<string>>([])
