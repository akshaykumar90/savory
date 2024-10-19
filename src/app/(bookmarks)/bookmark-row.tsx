"use client"

import EditTags from "@/components/edit-tags"
import { bookmarkQuery } from "@/lib/queries"
import { bookmarksToDeleteAtom } from "@/stores/dialog"
import {
  addToSelectionAtom,
  removeFromSelectionAtom,
  selectedBookmarkIdsAtom,
} from "@/stores/selection"
import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react"
import {
  CheckCircleIcon as CheckIcon,
  Bars3BottomLeftIcon as SelectIcon,
} from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import Link from "next/link"
import { useSearchParams } from "next/navigation"

export default function BookmarkRow({ bookmarkId }: { bookmarkId: string }) {
  const searchParams = useSearchParams()

  const { data } = useQuery(bookmarkQuery(bookmarkId))

  const [selectedBookmarkIds] = useAtom(selectedBookmarkIdsAtom)
  const [, addToSelection] = useAtom(addToSelectionAtom)
  const [, removeFromSelection] = useAtom(removeFromSelectionAtom)
  const [, setBookmarksToDelete] = useAtom(bookmarksToDeleteAtom)

  if (!data) {
    // Remove bookmark from page when it's deleted
    return null
  }

  const pageTags = searchParams.getAll("name")

  let { title, url, site, tags, date_added: dateAdded } = data

  const selected = selectedBookmarkIds.has(bookmarkId)
  let timestring = new Date(dateAdded).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <li>
      <div className="flex items-start gap-2 py-4">
        <button>
          {selected ? (
            <CheckIcon
              className="mx-3.5 mt-0.5 h-6 w-6 flex-none text-gray-600"
              aria-hidden="true"
              onClick={() => {
                removeFromSelection(bookmarkId)
              }}
            />
          ) : (
            <SelectIcon
              className="mx-4 mt-0.5 h-5 w-5 flex-none text-gray-400"
              aria-hidden="true"
              onClick={() => {
                addToSelection(bookmarkId)
              }}
            />
          )}
        </button>
        <div className="pr-2">
          <p className="text-base font-bold line-clamp-3 sm:line-clamp-2">
            <a href={url} target="_blank" rel="noopener">
              {title}
            </a>
          </p>
          <div className="mt-2 flex flex-row flex-wrap gap-2 text-sm text-zinc-500">
            {site ? (
              <Link
                className="decoration-primary underline-offset-1 hover:text-primary hover:underline"
                href={{ pathname: "/", query: { site } }}
              >
                {site}
              </Link>
            ) : null}
            {tags.map((tag, index) => (
              <Link
                key={index}
                className="decoration-primary underline-offset-1 hover:text-primary hover:underline"
                href={{ pathname: "/", query: { name: tag } }}
              >
                {tag}
              </Link>
            ))}
          </div>
          <div className="mt-2 flex flex-row gap-1.5 text-sm text-zinc-500">
            <span className="inline-block">{timestring}</span>
            {"·"}
            <span className="hidden sm:inline-flex">
              <Popover className="relative">
                <PopoverButton type="button">edit</PopoverButton>
                <PopoverPanel
                  focus
                  className="absolute left-0 z-50 mt-3 w-screen max-w-xs px-2 sm:px-0"
                >
                  <EditTags bookmarkId={bookmarkId} pageTags={pageTags} />
                </PopoverPanel>
              </Popover>
            </span>
            {"·"}
            <button
              type="button"
              onClick={() => setBookmarksToDelete([bookmarkId])}
            >
              <span>delete</span>
            </button>
          </div>
        </div>
      </div>
    </li>
  )
}
