"use client"

import PrimaryButton from "@/components/primary-button"
import { ArrowPathIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"

export default function RefreshButton() {
  const router = useRouter()

  return (
    <PrimaryButton onClick={() => router.refresh()}>
      <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" /> Retry
    </PrimaryButton>
  )
}
