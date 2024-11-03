"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"

export function RefreshOnFocus() {
  const { refresh } = useRouter()
  const searchParams = useSearchParams()

  const isSearchPage = !!searchParams.get("q")

  useEffect(() => {
    if (isSearchPage) {
      return
    }

    const onFocus = () => {
      refresh()
    }

    window.addEventListener("focus", onFocus)

    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [refresh, isSearchPage])

  return null
}
