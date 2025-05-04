"use server"

import { updateUser as dbUpdateUser } from "@/db/queries"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { SessionNotFoundError } from "./lib/auth0"
import { z } from "zod"

const editProfileFormSchema = z.object({
  name: z.string(),
})

export async function updateUser(prevState: null, formData: FormData) {
  const form = Object.fromEntries(formData.entries())
  const { name: fullName } = editProfileFormSchema.parse(form)
  try {
    await dbUpdateUser(fullName)
    revalidatePath("/settings")
    return null
  } catch (error) {
    if (error instanceof SessionNotFoundError) {
      redirect("/landing")
    }
    throw error
  }
}
