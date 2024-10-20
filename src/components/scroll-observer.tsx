"use client"

import { useEffect } from "react"

// Copied from https://www.nico.fyi/blog/tailwind-css-group-modifier-to-prevent-react-rerender
export default function ScrollObserver() {
  useEffect(() => {
    let rafId: number | null = null
    let isScrolled = false

    const handleScroll = () => {
      if (rafId) return

      rafId = requestAnimationFrame(() => {
        const shouldBeScrolled = window.scrollY > 0
        if (isScrolled !== shouldBeScrolled) {
          isScrolled = shouldBeScrolled
          document.body.setAttribute(
            "data-scroll",
            isScrolled ? "true" : "false"
          )
        }
        rafId = null
      })
    }

    handleScroll() // Call once to set initial state
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
      if (rafId) cancelAnimationFrame(rafId)
    }
  }, [])

  return null
}
