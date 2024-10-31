"use client"

import { bookmarkQuery } from "@/lib/queries"
import {
  addToSelectionAtom,
  removeFromSelectionAtom,
  selectedBookmarkIdsAtom,
} from "@/stores/selection"
import {
  CheckCircleIcon as CheckIcon,
  Bars3BottomLeftIcon as SelectIcon,
} from "@heroicons/react/20/solid"
import { useQuery } from "@tanstack/react-query"
import { useAtom } from "jotai"
import Link from "next/link"
import DeleteBookmarks from "./delete-bookmarks"
import EditTagsDialog from "./tags-dialog"
import TagsPopover from "./tags-popover"

export default function BookmarkRow({ bookmarkId }: { bookmarkId: string }) {
  const { data } = useQuery(bookmarkQuery(bookmarkId))

  const [selectedBookmarkIds] = useAtom(selectedBookmarkIdsAtom)
  const [, addToSelection] = useAtom(addToSelectionAtom)
  const [, removeFromSelection] = useAtom(removeFromSelectionAtom)

  if (!data) {
    // Remove bookmark from page when it's deleted
    return null
  }

  let { title, url, site, tags, date_added: dateAdded } = data

  const selected = selectedBookmarkIds.has(bookmarkId)
  let timestring = new Date(dateAdded).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <li className="flex items-start gap-2 py-4">
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
              prefetch={false}
            >
              {site}
            </Link>
          ) : null}
          {tags.map((tag, index) => (
            <Link
              key={index}
              className="decoration-primary underline-offset-1 hover:text-primary hover:underline"
              href={{ pathname: "/", query: { name: tag } }}
              prefetch={false}
            >
              {tag}
            </Link>
          ))}
        </div>
        <div className="mt-2 flex flex-row gap-1.5 text-sm text-zinc-500">
          <span className="inline-block">{timestring}</span>
          {"·"}
          <span className="hidden sm:inline-flex">
            <TagsPopover bookmarkId={bookmarkId}>
              <span>edit</span>
            </TagsPopover>
          </span>
          <span className="inline-flex sm:hidden">
            <EditTagsDialog bookmarkId={bookmarkId}>
              <span>edit</span>
            </EditTagsDialog>
          </span>
          {"·"}
          <DeleteBookmarks bookmarkId={bookmarkId}>
            <span>delete</span>
          </DeleteBookmarks>
        </div>
      </div>
    </li>
  )
}
