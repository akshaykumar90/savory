"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  CheckIcon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useTRPC } from "@/lib/trpc"
import type { Bookmark } from "@/lib/types"
import { BookmarkRowContent } from "../bookmark-row"

type Tag = { id: string; name: string; count: number }

export default function TagFilter({ tags: initialTags }: { tags: Tag[] }) {
  const trpc = useTRPC()
  const { data: tags = initialTags } = useQuery(
    trpc.tags.list.queryOptions(undefined, { initialData: initialTags }),
  )
  const [filterValue, setFilterValue] = useState("")
  const [sort, setSort] = useState<"count" | "alpha">("count")
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const sortedTags = [...tags].sort((a, b) =>
    sort === "count"
      ? b.count - a.count || a.name.localeCompare(b.name)
      : a.name.localeCompare(b.name),
  )
  const selected = tags.find((tag) => tag.id === selectedId) ?? sortedTags[0]
  // Preserve the initial selection when the order changes, too.
  useEffect(() => {
    if (selected && selected.id !== selectedId) setSelectedId(selected.id)
  }, [selected, selectedId])
  const filteredTags = sortedTags.filter((tag) =>
    tag.name.toLowerCase().includes(filterValue.toLowerCase()),
  )

  return (
    <div className="tags-explorer px-4 py-6 sm:px-6">
      <h1 className="text-2xl font-medium tracking-tight text-gray-900">
        Tags
      </h1>
      <p className="mt-1 text-sm text-gray-500">
        {tags.length} {tags.length === 1 ? "tag" : "tags"} in your library
      </p>
      {tags.length === 0 ? (
        <p className="mt-8 text-sm text-gray-500">
          Add tags to your bookmarks to organize them here.
        </p>
      ) : (
        <div className="mt-7 grid min-w-0 gap-6 lg:grid-cols-[13rem_minmax(0,1fr)]">
          <section
            aria-label="Tag list"
            className="min-w-0 border-b border-gray-200 pb-5 lg:border-b-0 lg:border-r lg:pr-5"
          >
            <label className="relative block">
              <span className="sr-only">Find a tag</span>
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                type="search"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                autoComplete="off"
                placeholder="Find a tag…"
                className="block w-full rounded-md border-gray-300 py-2 pl-9 pr-2 text-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </label>
            <div
              className="mt-3 flex rounded-md bg-gray-100 p-1"
              role="group"
              aria-label="Sort tags"
            >
              {(
                [
                  ["count", "Most used"],
                  ["alpha", "A–Z"],
                ] as const
              ).map(([value, label]) => (
                <button
                  key={value}
                  type="button"
                  aria-pressed={sort === value}
                  onClick={() => setSort(value)}
                  className={`flex-1 rounded px-2 py-1.5 text-sm ${sort === value ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-900"}`}
                >
                  {label}
                </button>
              ))}
            </div>
            <ul
              className="mt-3 max-h-48 space-y-1 overflow-y-auto lg:max-h-[calc(100vh-18rem)]"
              aria-label="Tags"
            >
              {filteredTags.map((tag) => (
                <li key={tag.id}>
                  <button
                    type="button"
                    aria-current={selected?.id === tag.id ? "true" : undefined}
                    onClick={() => setSelectedId(tag.id)}
                    className={`flex w-full items-center justify-between gap-3 rounded-md px-3 py-2.5 text-left text-sm ${selected?.id === tag.id ? "bg-sky-50 text-primary" : "text-gray-700 hover:bg-gray-50"}`}
                  >
                    <span className="min-w-0 break-words">{tag.name}</span>
                    <span className="text-xs tabular-nums text-gray-500">
                      {tag.count}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {filteredTags.length === 0 && (
              <p className="mt-4 text-sm text-gray-500" role="status">
                No tags match “{filterValue}”.
              </p>
            )}
          </section>
          {selected && <TagDetail key={selected.id} tag={selected} />}
        </div>
      )}
    </div>
  )
}

function TagDetail({ tag }: { tag: Tag }) {
  const trpc = useTRPC()
  const router = useRouter()
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState(tag.name)
  const [saved, setSaved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const renameButton = useRef<HTMLButtonElement>(null)
  const preview = useQuery(trpc.tags.preview.queryOptions({ tagId: tag.id }))
  const rename = useMutation(
    trpc.tags.renameTag.mutationOptions({
      onError: () => {
        requestAnimationFrame(() => inputRef.current?.focus())
      },
      onSuccess: async ({ name: newName }) => {
        queryClient.setQueryData(trpc.tags.list.queryKey(), (tags) =>
          tags?.map((item) =>
            item.id === tag.id ? { ...item, name: newName } : item,
          ),
        )
        // Main-view rows read disabled queries; update their cached labels directly.
        queryClient.setQueriesData<Bookmark>(
          { queryKey: trpc.bookmarks.get.pathKey() },
          (bookmark) =>
            bookmark
              ? {
                  ...bookmark,
                  tags: bookmark.tags.map((value) =>
                    value.toLowerCase() === tag.name.toLowerCase()
                      ? newName
                      : value,
                  ),
                }
              : bookmark,
        )
        await Promise.all([
          queryClient.invalidateQueries({ queryKey: trpc.tags.pathKey() }),
          queryClient.invalidateQueries({ queryKey: trpc.bookmarks.pathKey() }),
        ])
        setEditing(false)
        setSaved(true)
        router.refresh()
        requestAnimationFrame(() => renameButton.current?.focus())
      },
    }),
  )
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus()
      inputRef.current?.select()
    }
  }, [editing])
  const cleanedName = name.trim().replace(/\s+/g, " ")
  const cancel = () => {
    if (rename.isPending) return
    setEditing(false)
    rename.reset()
    requestAnimationFrame(() => renameButton.current?.focus())
  }
  return (
    <section className="min-w-0" aria-label="Selected tag">
      {editing ? (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            if (cleanedName && !rename.isPending)
              rename.mutate({ tagId: tag.id, name: cleanedName })
          }}
        >
          <div className="flex min-h-[42px] items-center gap-2">
            <input
              ref={inputRef}
              aria-label="Tag name"
              aria-describedby="rename-context"
              aria-invalid={rename.isError}
              autoComplete="off"
              value={name}
              disabled={rename.isPending}
              onChange={(event) => {
                setName(event.target.value)
                if (rename.isError) rename.reset()
              }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault()
                  cancel()
                }
              }}
              className="-ml-2 min-w-0 flex-1 rounded-md border-indigo-500 px-2 py-1 text-xl font-medium text-gray-900 focus:border-indigo-500 focus:ring-indigo-500"
            />
            <button
              type="submit"
              aria-label="Save tag name"
              disabled={!cleanedName || rename.isPending}
              className="rounded-md bg-primary p-2 text-white disabled:opacity-50"
            >
              <CheckIcon className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Cancel rename"
              disabled={rename.isPending}
              onClick={cancel}
              className="rounded-md border border-gray-300 p-2 text-gray-500 disabled:opacity-50"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          <div
            id="rename-context"
            className="min-h-[48px] pt-2 text-xs text-gray-500"
          >
            {rename.isError ? (
              <p role="alert" className="text-red-600">
                {rename.error.message}
              </p>
            ) : (
              <div className="flex flex-wrap justify-between gap-x-3 gap-y-1">
                <span>
                  {rename.isPending
                    ? "Saving…"
                    : `Renames this tag on all ${tag.count} ${tag.count === 1 ? "bookmark" : "bookmarks"}.`}
                </span>
                <span>Enter to save · Esc to cancel</span>
              </div>
            )}
            {["reading", "playlist"].includes(tag.name.toLowerCase()) &&
              cleanedName.toLowerCase() !== tag.name.toLowerCase() && (
                <p className="mt-2">
                  The {tag.name} sidebar shortcut will no longer show these
                  bookmarks.
                </p>
              )}
          </div>
        </form>
      ) : (
        <>
          <div className="flex min-h-[42px] items-center justify-between gap-2">
            <h2 className="min-w-0 break-words text-xl font-medium text-gray-900">
              {tag.name}
            </h2>
            <button
              ref={renameButton}
              type="button"
              aria-label={`Rename ${tag.name}`}
              onClick={() => {
                setName(tag.name)
                setSaved(false)
                rename.reset()
                setEditing(true)
              }}
              className="shrink-0 rounded-md p-2 text-primary hover:bg-gray-50"
            >
              <PencilSquareIcon className="h-5 w-5" />
            </button>
          </div>
          <p className="min-h-[48px] pt-2 text-xs text-gray-500">
            {tag.count} {tag.count === 1 ? "bookmark" : "bookmarks"}
          </p>
        </>
      )}
      <p className="border-b border-gray-200 py-3 text-xs text-gray-500">
        {tag.count > 3 ? "Latest 3 bookmarks" : "Latest bookmarks"}
      </p>
      {preview.isPending ? (
        <p className="py-6 text-sm text-gray-500" role="status">
          Loading bookmarks…
        </p>
      ) : preview.isError ? (
        <div role="alert" className="py-6 text-sm text-gray-600">
          Couldn’t load bookmarks.{" "}
          <button className="text-primary" onClick={() => preview.refetch()}>
            Try again
          </button>
        </div>
      ) : preview.data.length === 0 ? (
        <p className="py-6 text-sm text-gray-500">
          No bookmarks with this tag.
        </p>
      ) : (
        <ul>
          {preview.data.map((bookmark) => (
            <BookmarkRowContent key={bookmark.id} bookmark={bookmark} preview />
          ))}
        </ul>
      )}
      <div className="mt-3 border-t border-gray-200 pt-4">
        <Link
          href={{ pathname: "/", query: { name: tag.name } }}
          prefetch={false}
          className="text-sm text-primary hover:underline"
        >
          View all {tag.count} {tag.count === 1 ? "bookmark" : "bookmarks"} →
        </Link>
      </div>
      <p role="status" className="mt-3 min-h-5 text-xs text-primary">
        {saved ? "Tag renamed." : ""}
      </p>
    </section>
  )
}
