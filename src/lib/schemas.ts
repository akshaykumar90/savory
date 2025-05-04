import { z } from "zod"

// Request schemas

export const tagsRequestSchema = z.object({
  bookmarkIds: z.array(z.string()),
  name: z.string(),
})

export const deleteBookmarksRequestSchema = z.object({
  bookmarkIds: z.array(z.string()),
})

// Form schemas

export const editProfileFormSchema = z.object({
  name: z.string(),
})
