// Backend API (bapi)
import { getAccessToken } from "@auth0/nextjs-auth0"
import ky from "ky"
import {
  bookmarkSchema,
  bookmarksPageSchema,
  relatedTagsSchema,
  tagsCountSchema,
  userSchema,
} from "./schemas"

const apiBaseUrl = "https://api.savory.test:8081/api/v1"

const api = ky.create({
  prefixUrl: apiBaseUrl,
  timeout: 3000,
  hooks: {
    beforeRequest: [
      async (request) => {
        const { accessToken } = await getAccessToken()
        request.headers.set("Authorization", `Bearer ${accessToken}`)
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

export async function getTagsCount() {
  const responseData = await api.get("tags/").json()
  return tagsCountSchema.parse(responseData)
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

export async function bulkAddTag({
  bookmarkIds,
  name,
}: {
  bookmarkIds: string[]
  name: string
}) {
  return await api.post("tags/bulk", {
    json: {
      name,
      bookmark_ids: bookmarkIds,
    },
  })
}

export async function bulkRemoveTag({
  bookmarkIds,
  name,
}: {
  bookmarkIds: string[]
  name: string
}) {
  return await api.delete("tags/bulk", {
    json: {
      name,
      bookmark_ids: bookmarkIds,
    },
  })
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
