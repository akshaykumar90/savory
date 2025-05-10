import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"

export const users = pgTable("user", {
  id: uuid("id").primaryKey(),
  fullName: varchar("full_name"),
  auth0Sub: varchar("auth0_sub").notNull(),
  email: varchar("email").unique(),
  isEmailVerified: boolean("is_email_verified").default(false),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  lastLogin: timestamp("last_login", { withTimezone: true }).defaultNow(),
  loginCount: integer("login_count").default(1),
  miscData: jsonb("misc_data"),
})

export const userTags = pgTable("user_tag", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name").notNull(),
  displayName: varchar("display_name").notNull(),
  ownerId: uuid("owner_id").references(() => users.id),
})

export const bookmarks = pgTable("bookmark", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: varchar("title"),
  url: varchar("url").notNull(),
  dateAdded: timestamp("date_added", { withTimezone: true }).notNull(),
  site: varchar("site"),
  ownerId: uuid("owner_id")
    .references(() => users.id)
    .notNull(),
  search: text("search"),
})

export const bookmarkTags = pgTable("bookmark_tags", {
  bookmarkId: uuid("bookmark_id")
    .references(() => bookmarks.id)
    .notNull(),
  tagId: uuid("tag_id")
    .references(() => userTags.id)
    .notNull(),
})
