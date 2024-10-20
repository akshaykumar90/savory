import { z } from "zod"

export const userSchema = z.object({
  id: z.string(),
  is_active: z.boolean(),
  login_count: z.number(),
  created_at: z.number(),
  email: z.string().optional(),
  full_name: z.string().optional(),
})

export const bookmarkSchema = z.object({
  id: z.string(),
  title: z.string(),
  url: z.string(),
  site: z.string().optional(),
  date_added: z.number(),
  tags: z.array(z.string()),
})

const cursorSchema = z.object({
  has_next_page: z.boolean(),
  has_previous_page: z.boolean(),
  next_cursor: z.nullable(z.string()).transform((val) => val ?? undefined),
  previous_cursor: z.nullable(z.string()).transform((val) => val ?? undefined),
})

export const bookmarksPageSchema = z.object({
  total: z.number(),
  bookmarks: z.array(bookmarkSchema),
  cursor_info: cursorSchema,
})

export const tagsCountSchema = z.array(
  z.object({
    name: z.string(),
    count: z.number(),
  })
)

export const relatedTagsSchema = z.object({
  tags_list: tagsCountSchema,
  has_untagged: z.boolean(),
})
