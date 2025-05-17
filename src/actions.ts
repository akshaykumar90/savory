"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { z } from "zod"
import { getSession } from "./db/drizzle"
import { updateUser as dbUpdateUser, getUser } from "./db/queries/user"

const editProfileFormSchema = z.object({
  name: z.string(),
})

export async function updateUser(prevState: null, formData: FormData) {
  const form = Object.fromEntries(formData.entries())
  const { name: fullName } = editProfileFormSchema.parse(form)
  const db = await getSession()
  const user = await getUser(db)
  if (!user) {
    redirect("/landing")
  }
  await dbUpdateUser(db, user.id, fullName)
  revalidatePath("/settings")
  return null
}
