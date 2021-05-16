import axios from 'axios'

function isLoggedIn() {}

function login(token) {}

function logout() {}

function refreshToken() {}

function handleAuthFailure() {
  // call refreshToken above
}

export function fetchRecent({ num, before }) {
  return axios.post('/bookmarks', { num, before })
}

export function getBookmarksWithTag({ tags, site, num, after }) {
  return axios.post('/bookmarks', { tags, site, num, after })
}

export function searchBookmarks({ query, num, skip, site, tags }) {
  return axios.post('/bookmarks/search', { query, num, skip, site, tags })
}

export function getTagsCount() {
  return axios.get('/tags')
}

export function createBookmark({ bookmark }) {
  return axios.post('/bookmarks/add', bookmark)
}

export async function importBookmarks({ chunk }) {
  return axios.post('/bookmarks/import', {
    bookmarks: chunk,
  })
}

export async function deleteBookmarks({ bookmarkIds }) {
  return axios.delete('/bookmarks', {
    data: {
      bookmark_ids: bookmarkIds,
    },
  })
}

export function addTag({ bookmarkId, newTag }) {
  return axios.post('/tags', {
    name: newTag,
    bookmark_id: bookmarkId,
  })
}

export function bulkAddTag({ bookmarkIds, newTag }) {
  return axios.post('/tags/bulk', {
    name: newTag,
    bookmark_ids: bookmarkIds,
  })
}

export function removeTag({ bookmarkId, tagToRemove }) {
  return axios.delete('/tags', {
    data: {
      name: tagToRemove,
      bookmark_id: bookmarkId,
    },
  })
}

export function bulkRemoveTag({ bookmarkIds, tagToRemove }) {
  return axios.delete('/tags/bulk', {
    data: {
      name: tagToRemove,
      bookmark_ids: bookmarkIds,
    },
  })
}

export function loadUserData() {
  return axios.get('/users/me')
}

export function markBookmarksImported() {
  return axios.put('/users/me', {
    is_chrome_imported: true,
  })
}
