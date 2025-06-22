"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function RefreshOnFocus() {
  const { refresh } = useRouter()

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
