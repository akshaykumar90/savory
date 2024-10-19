"use client"

import { MagnifyingGlassIcon } from "@heroicons/react/20/solid"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useDebouncedCallback } from "use-debounce"

function SearchBar() {
  const router = useRouter()
  let searchParams = useSearchParams()
  let query = searchParams.get("q") ?? ""

  const handleSearch = useDebouncedCallback((newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (!newQuery) {
      params.delete("cursor")
      params.delete("q")
      router.push(`/?${params.toString()}`)
      return
    }

    let isSearch = !!query
    params.delete("cursor")
    params.set("q", newQuery)
    const url = `/?${params.toString()}`
    if (isSearch) {
      router.replace(url)
    } else {
      router.push(url)
    }
  }, 300)

  return (
    <div className="flex flex-1 justify-center lg:justify-end">
      <div className="w-full px-2 lg:px-6">
        <label htmlFor="search" className="sr-only">
          Search bookmarks
        </label>
        <div className="text-black-200 relative h-[46px] focus-within:text-gray-400">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" />
          </div>
          <input
            type="text"
            defaultValue={query}
            placeholder="Search bookmarks"
            autoComplete="off"
            spellCheck="false"
            id="search"
            name="search"
            className="text-black-100 placeholder-black-200 block h-full w-full rounded-md border border-transparent bg-gray-400 bg-opacity-25 py-2 pl-10 pr-3 leading-5 focus:bg-white focus:text-gray-900 focus:placeholder-gray-400 focus:outline-none focus:ring-1 sm:text-sm"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>
    </div>
  )
}

export default function OptionalSearchBar() {
  let pathname = usePathname()
  return pathname === "/" ? <SearchBar /> : null
}
