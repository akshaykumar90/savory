"use client"

import { useIsMutating } from "@tanstack/react-query"
import { useEffect, useRef } from "react"

export function WaitForMutations() {
  const isMutating = useIsMutating()
  const isMutatingRef = useRef(isMutating)

  // Update the ref whenever isMutating changes
  useEffect(() => {
    isMutatingRef.current = isMutating
  }, [isMutating])

  useEffect(() => {
    const beforeUnload = (event: BeforeUnloadEvent) => {
      if (isMutatingRef.current > 0) {
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
  }, [])

  return null
}
