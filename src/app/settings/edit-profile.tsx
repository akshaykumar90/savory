"use client"

import { updateUser } from "@/actions"
import PrimaryButton from "@/components/primary-button"
import { useActionState } from "react"

const mktSiteUrl = process.env.NEXT_PUBLIC_MKT_SITE_URL
const feedbackUrl = `${mktSiteUrl}/feedback`

export default function EditProfile(props: {
  userCreatedAt: Date
  fullName?: string
  email?: string
}) {
  let { userCreatedAt, fullName, email } = props
  const [state, formAction, isPending] = useActionState(updateUser, null)
  return (
    <form className="space-y-4" action={formAction}>
      <div>
        <div>
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Account
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Member since{" "}
            {userCreatedAt.toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
        <div className="mt-6 space-y-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <div className="mt-2">
              <input
                type="text"
                name="name"
                id="name"
                autoComplete="name"
                defaultValue={fullName}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="mt-2">
              <input
                type="email"
                name="email"
                id="email"
                disabled={true}
                value={email}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-50 disabled:text-gray-500 sm:text-sm"
              />
            </div>
            <p className="mt-2 text-sm text-gray-500" id="email-description">
              <a
                className="underline underline-offset-2"
                target="_blank"
                href={feedbackUrl}
              >
                Contact us
              </a>{" "}
              to update your email.
            </p>
          </div>
        </div>
      </div>
      <div className="pt-5">
        <div className="flex justify-end">
          <PrimaryButton isSubmitButton={true} isDisabled={isPending}>
            Update
          </PrimaryButton>
        </div>
      </div>
    </form>
  )
}
