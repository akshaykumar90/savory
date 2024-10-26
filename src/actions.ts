"use server"

import * as bapi from "@/lib/bapi"
import { revalidatePath } from "next/cache"

export async function updateUser(prevState: null, formData: FormData) {
  const fullName = formData.get("name")
  if (typeof fullName === "string") {
    await bapi.updateUser({ fullName })
    revalidatePath("/settings")
  }

  return null
}
