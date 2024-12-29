"use client"

import { useState } from "react"
import Link from "next/link"

export default function TagFilter(props: {
  tags: Array<{ name: string; count: number }>
}) {
  const tags = props.tags
  const [filterValue, setFilterValue] = useState("")
  const [filteredTags, setFilteredTags] = useState(tags)

  return (
    <>
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="-ml-4 -mt-2 flex flex-nowrap items-center justify-between">
          <div className="ml-4 mt-2 flex-shrink-0">
            <input
              type="text"
              value={filterValue}
              onChange={(e) => {
                const value = e.target.value
                setFilterValue(value)
                const filtered = tags.filter((tag) =>
                  tag.name.toLowerCase().includes(value.toLowerCase())
                )
                setFilteredTags(filtered)
              }}
              autoComplete="off"
              name="filter-tags"
              id="filter-tags"
              className="block w-full rounded-md border-gray-300 bg-transparent text-default shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Filter tags&hellip;"
            />
          </div>
          <div className="ml-4 mt-2">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              {filteredTags.length}
            </h3>
          </div>
        </div>
      </div>
      <ul role="list">
        {filteredTags.map(({ name, count }) => (
          <li key={name}>
            <Link
              href={{ pathname: "/", query: { name } }}
              prefetch={false}
              className="flex w-full flex-row justify-between rounded-lg p-4 text-gray-900 hover:bg-gray-50 hover:text-primary"
            >
              <span className="line-clamp-1">{name}</span>
              <span>{count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
