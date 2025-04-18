"use server"

import * as bapi from "@/lib/bapi"
import { revalidatePath } from "next/cache"
import { editProfileFormSchema } from "./lib/schemas"
import { AccessTokenError } from "@auth0/nextjs-auth0/errors"
import { redirect } from "next/navigation"

export async function updateUser(prevState: null, formData: FormData) {
  const form = Object.fromEntries(formData.entries())
  const { name: fullName } = editProfileFormSchema.parse(form)
  try {
    await bapi.updateUser({ fullName })
    revalidatePath("/settings")
    return null
  } catch (error) {
    if (error instanceof AccessTokenError) {
      redirect("/landing")
    }
    throw error
  }
}
