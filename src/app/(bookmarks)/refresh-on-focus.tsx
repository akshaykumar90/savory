"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function RefreshOnFocus() {
  const { refresh } = useRouter()
  const searchParams = useSearchParams()

  const isSearchPage = !!searchParams.get("q")

  useEffect(() => {
    const onFocus = () => {
      // Check if we're on a search page at the time of focus
      const currentSearchParams = new URLSearchParams(window.location.search)
      const isCurrentlySearchPage = !!currentSearchParams.get("q")

      if (!isCurrentlySearchPage) {
        refresh()
      }
    }

    window.addEventListener("focus", onFocus)

    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [refresh])

  return null
}
