"use client"

import TagButton from "@/components/tag-button"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"

export default function DrillDownCard({
  showUntagged,
  tags,
}: {
  showUntagged: boolean
  tags: string[]
}) {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" })
    }
  })

  return (
    <div>
      <nav
        ref={scrollContainerRef}
        className="mx-3 flex items-center gap-4 overflow-x-auto bg-white py-4"
      >
        <p className="flex-none text-xs uppercase tracking-widest text-slate-600">
          Add to filter
        </p>
        {showUntagged && (
          <TagButton
            name="Untagged"
            accented={true}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete("cursor")
              params.delete("name")
              params.set("untagged", "1")
              const url = `/?${params.toString()}`
              router.push(url)
            }}
          />
        )}
        {tags.map((name) => (
          <TagButton
            key={name}
            name={name}
            onClick={() => {
              const params = new URLSearchParams(searchParams.toString())
              params.delete("cursor")
              params.append("name", name)
              const url = `/?${params.toString()}`
              router.push(url)
            }}
          />
        ))}
      </nav>
    </div>
  )
}
