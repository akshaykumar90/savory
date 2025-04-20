// Backend API (bapi)
import ky from "ky"
import { auth0 } from "./auth0"
import {
  bookmarkSchema,
  bookmarksPageSchema,
  relatedTagsSchema,
  tagsCountSchema,
  userSchema,
} from "./schemas"

const apiBaseUrl = process.env.API_BASE_URL

const api = ky.create({
  prefixUrl: apiBaseUrl,
  timeout: 3000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const token = await auth0.getAccessToken()
        request.headers.set("Authorization", `Bearer ${token.token}`)
      },
    ],
  },
})

export async function getBookmarks({
  num,
  tags,
  site,
  cursor,
  untagged,
}: {
  num: number
  tags?: string[]
  site?: string
  cursor?: string
  untagged?: boolean
}) {
  const responseData = await api
    .post("bookmarks/", {
      json: {
        num,
        tags,
        site,
        cursor,
        untagged,
      },
    })
    .json()
  return bookmarksPageSchema.parse(responseData)
}

export async function searchBookmarks({
  query,
  tags,
  site,
  num,
  cursor,
  untagged,
}: {
  query: string
  num: number
  tags?: string[]
  site?: string
  cursor?: string
  untagged?: boolean
}) {
  const responseData = await api
    .post("bookmarks/search", {
      json: {
        query,
        tags,
        site,
        num,
        cursor,
        untagged,
      },
    })
    .json()
  return bookmarksPageSchema.parse(responseData)
}

export async function getDrillDownTags({
  tags,
  site,
}: {
  tags?: string[]
  site?: string
}) {
  const responseData = await api
    .post("tags/recs", { json: { tags, site } })
    .json()
  return relatedTagsSchema.parse(responseData)
}

export async function deleteBookmarks({
  bookmarkIds,
}: {
  bookmarkIds: string[]
}) {
  return await api.delete("bookmarks/", {
    json: {
      bookmark_ids: bookmarkIds,
    },
  })
}

export async function addBookmark({
  title,
  url,
  dateAddedMs,
}: {
  title: string
  url: string
  dateAddedMs: number
}) {
  const responseData = await api
    .post("bookmarks/add", {
      json: {
        title,
        url,
        date_added: dateAddedMs,
      },
    })
    .json()
  return bookmarkSchema.parse(responseData)
}

export async function loadUserData() {
  const responseData = await api.get("users/me").json()
  return userSchema.parse(responseData)
}

export async function updateUser({ fullName }: { fullName: string }) {
  return await api.put("users/me", {
    json: {
      full_name: fullName,
    },
  })
}
