"use client"

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/20/solid"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { useRouter, useSearchParams } from "next/navigation"
import { useTransition } from "react"

function getNextUrl(searchParams: URLSearchParams, cursor: string | undefined) {
  const params = new URLSearchParams(searchParams.toString())
  if (cursor) {
    params.set("cursor", cursor)
  } else {
    params.delete("cursor")
  }
  return `/?${params.toString()}`
}

export default function PaginationCard({
  message,
  showClearFiltersButton,
  nextCursor,
  prevCursor,
}: {
  message: string
  showClearFiltersButton: boolean
  nextCursor?: string
  prevCursor?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [pending, startTransition] = useTransition()
  const hasNextPage = Boolean(nextCursor)
  const hasPreviousPage = Boolean(prevCursor)

  return (
    <div>
      <nav
        className="mx-3 flex items-center justify-between gap-4 py-3"
        aria-label="Pagination"
      >
        <p className="truncate text-sm font-medium text-slate-600">{message}</p>
        <div className="flex space-x-4">
          {showClearFiltersButton && (
            <span className="relative z-0 inline-flex rounded-md shadow-sm">
              <button
                type="button"
                className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                onClick={() => router.push("/")}
              >
                <span className="sr-only">Clear filters</span>
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </span>
          )}
          <span className="relative z-0 inline-flex rounded-md shadow-sm">
            <button
              type="button"
              className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50"
              disabled={!hasPreviousPage || pending}
              onClick={() => {
                if (hasPreviousPage) {
                  const url = getNextUrl(searchParams, prevCursor)
                  startTransition(() => router.push(url))
                }
              }}
            >
              <span className="sr-only">Previous</span>
              <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              className="relative -ml-px inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:pointer-events-none disabled:opacity-50"
              disabled={!hasNextPage || pending}
              onClick={() => {
                if (hasNextPage) {
                  const url = getNextUrl(searchParams, nextCursor)
                  startTransition(() => router.push(url))
                }
              }}
            >
              <span className="sr-only">Next</span>
              <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </span>
        </div>
      </nav>
    </div>
  )
}
