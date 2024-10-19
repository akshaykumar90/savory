"use client"

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react"
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline"
import { useAtom } from "jotai"
import { bookmarksToDeleteAtom } from "@/stores/dialog"
import { useResetAtom } from "jotai/utils"
import { removeMultipleFromSelectionAtom } from "@/stores/selection"
import { deleteBookmark } from "@/actions"
import { startTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"

export default function DeleteBookmarksDialog() {
  const [bookmarks] = useAtom(bookmarksToDeleteAtom)
  const closeDialog = useResetAtom(bookmarksToDeleteAtom)
  const [, removeFromSelection] = useAtom(removeMultipleFromSelectionAtom)
  const queryClient = useQueryClient()

  return (
    <Dialog
      open={bookmarks.length > 0}
      onClose={closeDialog}
      className="relative z-30"
    >
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
      />

      <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
        <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
          <DialogPanel
            transition
            className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
          >
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                <ExclamationTriangleIcon
                  aria-hidden="true"
                  className="h-6 w-6 text-red-600"
                />
              </div>
              <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <DialogTitle
                  as="h3"
                  className="text-base font-semibold leading-6 text-gray-900"
                >
                  {bookmarks.length > 1
                    ? `Delete ${bookmarks.length} bookmarks?`
                    : "Delete bookmark?"}
                </DialogTitle>
              </div>
            </div>
            <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                data-autofocus
                onClick={() => {
                  // optimistic update
                  bookmarks.forEach((id) => {
                    queryClient.setQueryData(["bookmarks", id], null)
                  })
                  removeFromSelection(bookmarks)
                  closeDialog()
                  startTransition(() => deleteBookmark(bookmarks))
                }}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => closeDialog()}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  )
}