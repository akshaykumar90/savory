"use client"

import EditTags from "@/components/edit-tags"
import { selectedBookmarkIdsAtom } from "@/stores/selection"
import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { TagIcon, TrashIcon, XMarkIcon } from "@heroicons/react/20/solid"
import clsx from "clsx"
import { useAtom } from "jotai"
import { useResetAtom } from "jotai/utils"
import { useSearchParams } from "next/navigation"
import DeleteBookmarks from "./delete-bookmarks"
import EditTagsDialog from "./tags-dialog"

export default function TopToolbar() {
  const searchParams = useSearchParams()
  const [selectedBookmarkIds] = useAtom(selectedBookmarkIdsAtom)
  const clearSelectedIds = useResetAtom(selectedBookmarkIdsAtom)

  const pageTags = searchParams.getAll("name")
  const numSelected = selectedBookmarkIds.size

  return (
    <Transition show={numSelected > 0}>
      <div
        className={clsx([
          // Base styles
          "flex h-16 mx-4 items-center justify-between bg-white sm:justify-start transition",
          // Closed styles
          "data-[closed]:opacity-0 data-[closed]:-translate-y-6",
          // Entering styles
          "data-[enter]:duration-200 data-[enter]:ease-out",
          // Leaving styles
          "data-[leave]:duration-150 data-[leave]:ease-in",
        ])}
      >
        <div className="flex items-center">
          <button
            type="button"
            className="inline-flex items-center rounded-full border border-transparent bg-transparent text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:p-2"
            onClick={clearSelectedIds}
          >
            <XMarkIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="mx-4 tabular-nums">{numSelected} selected</div>
        </div>
        <div className="sm:px-6 lg:px-8">
          <div className="flex justify-between py-3">
            <div>
              <span className="relative z-0 inline-flex space-x-3 rounded-md">
                <span className="hidden sm:inline-flex sm:shadow-sm">
                  <Popover className="relative">
                    <PopoverButton
                      type="button"
                      className="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                    >
                      <TagIcon
                        className="mr-2.5 h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                      <span>Edit</span>
                    </PopoverButton>
                    <PopoverPanel
                      focus
                      className="absolute left-0 z-50 mt-3 w-screen max-w-xs px-2 sm:px-0"
                    >
                      <EditTags
                        bookmarkId={Array.from(selectedBookmarkIds)}
                        pageTags={pageTags}
                      />
                    </PopoverPanel>
                  </Popover>
                </span>
                <span className="inline-flex sm:hidden">
                  <EditTagsDialog
                    bookmarkId={Array.from(selectedBookmarkIds)}
                    className="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <TagIcon
                      className="mr-2.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </EditTagsDialog>
                </span>
                <span className="inline-flex sm:shadow-sm">
                  <DeleteBookmarks
                    bookmarkId={Array.from(selectedBookmarkIds)}
                    className="relative -ml-px inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 focus:z-10 focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <TrashIcon
                      className="mr-2.5 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Delete</span>
                  </DeleteBookmarks>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  )
}
