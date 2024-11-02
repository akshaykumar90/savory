"use client"

import Image from "next/image"
import art from "../../assets/meditating.png"
import PrimaryButton from "@/components/primary-button"
import { ArrowPathIcon } from "@heroicons/react/20/solid"
import { useRouter } from "next/navigation"

export default function ErrorScreen(props: {
  title?: string
  detail?: string
}) {
  const { title, detail } = props
  const router = useRouter()

  return (
    <div className="py-16 px-4 text-center sm:px-6 lg:px-8">
      <Image
        className="mx-auto w-3/4 opacity-75 sm:w-1/2"
        src={art}
        alt=""
        width="400"
        height="314"
      />
      <h3 className="mt-10 text-sm font-medium text-gray-900">
        {title ?? "There was an error."}
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        {detail ?? "Please try again."}
      </p>
      <div className="mt-6">
        <PrimaryButton onClick={() => router.refresh()}>
          <ArrowPathIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />{" "}
          Retry
        </PrimaryButton>
      </div>
    </div>
  )
}
