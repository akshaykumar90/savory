export type BookmarksCursor = {
  type: "bookmarks"
  cursorDate: Date
}

export type SearchCursor = {
  type: "search"
  cursorDate: Date
}

export type CursorType = BookmarksCursor | SearchCursor

export type Bookmark = {
  id: string
  title: string | null
  url: string
  dateAdded: Date
  site: string | null
  tags: string[]
}
