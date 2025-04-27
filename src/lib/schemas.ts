import { z } from "zod"

export const bookmarkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  site: z.string().optional(),
  dateAdded: z.date(),
  tags: z.array(z.string()),
})

export const tagsCountSchema = z.array(
  z.object({
    name: z.string(),
    count: z.number(),
  })
)

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
