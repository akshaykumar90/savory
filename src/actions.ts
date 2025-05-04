"use server"

import { updateUser as dbUpdateUser, getUser } from "@/db/queries"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"

const editProfileFormSchema = z.object({
  name: z.string(),
})

export async function updateUser(prevState: null, formData: FormData) {
  const form = Object.fromEntries(formData.entries())
  const { name: fullName } = editProfileFormSchema.parse(form)
  const user = await getUser()
  if (!user) {
    redirect("/landing")
  }
  await dbUpdateUser(user.id, fullName)
  revalidatePath("/settings")
  return null
}
