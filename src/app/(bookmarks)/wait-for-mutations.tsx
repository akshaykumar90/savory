"use client"

import { useIsMutating } from "@tanstack/react-query"
import { useEffect } from "react"

export function WaitForMutations() {
  const isMutating = useIsMutating()

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (isMutating > 0) {
        // Cancel the event as stated by the standard.
        event.preventDefault()
        // Older browsers supported custom message
        return (event.returnValue =
          "There is pending work. Sure you want to leave?")
      }
    }

    window.addEventListener("beforeunload", beforeUnload)

    return () => {
      window.removeEventListener("beforeunload", beforeUnload)
    }
  }, [isMutating])

  return null
}
