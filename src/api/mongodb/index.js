import { BSON } from 'mongodb-stitch-browser-sdk'
import { getAuthWrapper } from '../../auth'

const app = () => getAuthWrapper().getMongoApp()

export async function importBookmarks({ chunk }) {
  return app().callFunction('importBookmarks', [chunk])
}

export function fetchRecent({ num, after }) {
  return app()
    .callFunction('getBookmarks', [num, after])
    .then((resp) => {
      for (const doc of resp.bookmarks) {
        doc.id = doc._id.toString()
      }
      return resp
    })
}

export function getBookmarksWithTag({ tags, site, num, after }) {
  return app()
    .callFunction('getBookmarksWithTag', [{ tags, site }, num, after])
    .then((resp) => {
      for (const doc of resp.bookmarks) {
        doc.id = doc._id.toString()
      }
      return resp
    })
}

export async function getTagsCount() {
  let result = await app().callFunction('getTagsCount')
  return result.map(({ tag_name: tagName, count }) => ({ tagName, count }))
}

export async function createBookmark({ bookmark }) {
  return app()
    .callFunction('addBookmark', [bookmark])
    .then((result) => {
      result.id = result._id.toString()
      return result
    })
}

export async function deleteBookmarks({ bookmarkIds }) {
  return app().callFunction('deleteBookmarks', [
    bookmarkIds.map((x) => new BSON.ObjectId(x)),
  ])
}

export function addTag({ bookmarkId, newTag }) {
  return app().callFunction('addTag', [newTag, new BSON.ObjectId(bookmarkId)])
}

export function bulkAddTag({ bookmarkIds, newTag }) {
  return app().callFunction('bulkAddTag', [
    newTag,
    bookmarkIds.map((x) => new BSON.ObjectId(x)),
  ])
}

export function removeTag({ bookmarkId, tagToRemove }) {
  return app().callFunction('removeTag', [
    tagToRemove,
    new BSON.ObjectId(bookmarkId),
  ])
}

export function bulkRemoveTag({ bookmarkIds, newTag }) {
  return app().callFunction('bulkRemoveTag', [
    newTag,
    bookmarkIds.map((x) => new BSON.ObjectId(x)),
  ])
}

export function loadUserData() {
  return app().callFunction('loadUserData', [])
}

export function markBookmarksImported() {
  return app().callFunction('markBookmarksImported', [])
}

export function searchBookmarks({ query, num, skip, site, tags }) {
  return app()
    .callFunction('searchBookmarksV2', [query, num, skip, site, tags])
    .then((resp) => {
      for (const doc of resp.bookmarks) {
        doc.id = doc._id.toString()
      }
      return resp
    })
}
