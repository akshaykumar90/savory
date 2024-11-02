"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function RefreshOnFocus() {
  const { refresh } = useRouter()

  useEffect(() => {
    const onFocus = () => {
      // TODO: Don't refresh search page on focus
      refresh()
    }

    window.addEventListener("focus", onFocus)

    return () => {
      window.removeEventListener("focus", onFocus)
    }
  }, [refresh])

  return null
}
