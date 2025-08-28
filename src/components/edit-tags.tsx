import _ from "lodash"
import { useState } from "react"
import TagButton from "./tag-button"
import useBookmarkTags from "@/lib/use-bookmark-tags"

type EditTagsProps = {
  bookmarkId: string | string[]
  pageTags?: string[]
}

const CASE_SENSITIVE_TAGS = false

function lookup(
  tags: Array<{ name: string; count: number }>,
  query: string
): string[] {
  const searchQuery = CASE_SENSITIVE_TAGS ? query : query.toLowerCase()

  let searchResults = []

  for (const { name: tag, count: freq } of tags) {
    const candidate = CASE_SENSITIVE_TAGS ? tag : tag.toLowerCase()
    if (candidate.startsWith(searchQuery)) {
      searchResults.push([tag, freq] as const)
    }
  }

  // Sort the search results by decreasing tag frequency
  searchResults.sort(([, freq1], [, freq2]) => {
    return -(freq1 - freq2)
  })

  return searchResults.map(([tag]) => tag)
}

function tagsWithAccentBit(allTags: string[], pageTags: string[]) {
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

export default function EditTags({ bookmarkId, pageTags }: EditTagsProps) {
  const bookmarkIds = Array.isArray(bookmarkId) ? bookmarkId : [bookmarkId]

  const [newTag, setNewTag] = useState("")

  let {
    tags: bookmarkTags,
    allTags,
    addTag,
    removeTag,
  } = useBookmarkTags(bookmarkIds)

  const tags = tagsWithAccentBit(bookmarkTags, pageTags ?? [])

  const handleAddTag = (tagName: string) => {
    setNewTag("")
    if (tagName && !bookmarkTags.includes(tagName)) {
      addTag({ name: tagName, bookmarkIds })
    }
  }

  let placeholder = ""
  let tagSuggestion = ""
  if (newTag && allTags) {
    let candidates = lookup(allTags, newTag)

    // Remove existing tags from autocomplete candidates
    _.pullAll(candidates, bookmarkTags)

    if (candidates.length) {
      tagSuggestion = candidates[0]
      let suggestion = tagSuggestion.split("")
      let userInput = newTag.split("")
      userInput.forEach((letter, key) => {
        if (letter !== suggestion[key]) {
          suggestion[key] = letter
        }
      })
      placeholder = suggestion.join("")
    }
  }

  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
      <div className="divide-y divide-gray-200">
        <div className="flex flex-wrap gap-2 px-4 py-4 sm:px-6">
          {tags.length === 0 && <span>No tags</span>}
          {tags.map((tag) => (
            <TagButton
              key={tag.name}
              name={tag.name}
              showRemove={true}
              accented={tag.accented}
              onClick={() => removeTag({ name: tag.name, bookmarkIds })}
            />
          ))}
        </div>
        <div className="px-4 py-5 sm:p-6">
          <div className="relative flex">
            <label htmlFor="add-tag" className="sr-only">
              Add tag
            </label>
            <input
              type="text"
              tabIndex={-1}
              placeholder={placeholder}
              className="block w-full rounded-md border-gray-300 bg-white shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <input
              type="text"
              tabIndex={1}
              autoComplete="off"
              name="add-tag"
              id="add-tag"
              value={newTag}
              className="absolute top-0 left-0 block w-full rounded-md border-gray-300 bg-transparent text-default shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              onChange={(e) => setNewTag(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  let cleanedTagName = newTag.trim().replace(/\s+/g, " ")
                  handleAddTag(cleanedTagName)
                }
              }}
              onKeyDown={(e) => {
                if (e.key === "Tab") {
                  e.preventDefault()
                  const tagToAdd = tagSuggestion.length ? tagSuggestion : newTag
                  let cleanedTagName = tagToAdd.trim().replace(/\s+/g, " ")
                  handleAddTag(cleanedTagName)
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
