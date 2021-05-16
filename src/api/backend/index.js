import axios from 'axios'

const instance = axios.create({
  // `baseURL` will be prepended to `url` unless `url` is absolute.
  // It can be convenient to set `baseURL` for an instance of axios to pass relative URLs
  // to methods of that instance.
  baseURL: process.env.API_BASE_URL,

  // `timeout` specifies the number of milliseconds before the request times out.
  // If the request takes longer than `timeout`, the request will be aborted.
  timeout: 3000, // default is `0` (no timeout)

  // `withCredentials` indicates whether or not cross-site Access-Control requests
  // should be made using credentials
  withCredentials: true,

  // `xsrfCookieName` is the name of the cookie to use as a value for xsrf token
  xsrfCookieName: 'XSRF-TOKEN', // default

  // `xsrfHeaderName` is the name of the http header that carries the xsrf token value
  xsrfHeaderName: 'X-XSRF-TOKEN', // default
})

export function login(token) {
  return instance.post('/login/access-token', { token })
}

export function logout() {
  return instance.post('/logout')
}

export function refreshToken() {
  return instance.post('/refresh')
}

export function fetchRecent({ num, before }) {
  return instance.post('/bookmarks', { num, before })
}

export function getBookmarksWithTag({ tags, site, num, after }) {
  return instance.post('/bookmarks', { tags, site, num, after })
}

export function searchBookmarks({ query, num, skip, site, tags }) {
  return instance.post('/bookmarks/search', { query, num, skip, site, tags })
}

export function getTagsCount() {
  return instance.get('/tags')
}

export function createBookmark({ bookmark }) {
  return instance.post('/bookmarks/add', bookmark)
}

export function importBookmarks({ chunk }) {
  return instance.post('/bookmarks/import', {
    bookmarks: chunk,
  })
}

export function deleteBookmarks({ bookmarkIds }) {
  return instance.delete('/bookmarks', {
    data: {
      bookmark_ids: bookmarkIds,
    },
  })
}

export function addTag({ bookmarkId, newTag }) {
  return instance.post('/tags', {
    name: newTag,
    bookmark_id: bookmarkId,
  })
}

export function bulkAddTag({ bookmarkIds, newTag }) {
  return instance.post('/tags/bulk', {
    name: newTag,
    bookmark_ids: bookmarkIds,
  })
}

export function removeTag({ bookmarkId, tagToRemove }) {
  return instance.delete('/tags', {
    data: {
      name: tagToRemove,
      bookmark_id: bookmarkId,
    },
  })
}

export function bulkRemoveTag({ bookmarkIds, tagToRemove }) {
  return instance.delete('/tags/bulk', {
    data: {
      name: tagToRemove,
      bookmark_ids: bookmarkIds,
    },
  })
}

export function loadUserData() {
  return instance.get('/users/me')
}

export function markBookmarksImported() {
  return instance.put('/users/me', {
    is_chrome_imported: true,
  })
}
