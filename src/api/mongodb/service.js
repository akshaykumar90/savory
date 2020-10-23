import { BSON, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import { getAuthWrapper } from '../../auth'
import _ from 'lodash'

// TODO: This does not handle serverless functions!!!
const mongoCollection = _.memoize((name) => {
  const authService = getAuthWrapper()
  const mongoClient = authService
    .getMongoApp()
    .getServiceClient(RemoteMongoClient.factory, 'savorydb')
  return authService.withAuthHandling(mongoClient.db('savory').collection(name))
})

const mongoApp = () => getAuthWrapper().getMongoApp()

export async function importBookmarks({ chunk }) {
  return mongoApp().callFunction('importBookmarks', [chunk])
}

export function fetchRecent({ num, after }) {
  return mongoApp()
    .callFunction('getBookmarks', [num, after])
    .then((resp) => {
      for (const doc of resp.bookmarks) {
        doc.id = doc._id.toString()
      }
      return resp
    })
}

export function getBookmarksWithTag({ tags, site, num, after }) {
  return mongoApp()
    .callFunction('getBookmarksWithTag', [{ tags, site }, num, after])
    .then((resp) => {
      for (const doc of resp.bookmarks) {
        doc.id = doc._id.toString()
      }
      return resp
    })
}

export async function getTagsCount() {
  let result = await mongoApp().callFunction('getTagsCount')
  return result.map(({ tag_name: tagName, count }) => ({ tagName, count }))
}

export async function createBookmark({ bookmark }) {
  return mongoApp()
    .callFunction('addBookmark', [bookmark])
    .then((result) => {
      result.id = result._id.toString()
      return result
    })
}

export async function deleteBookmarks({ bookmarkIds }) {
  return mongoApp().callFunction('deleteBookmarks', [
    bookmarkIds.map((x) => new BSON.ObjectId(x)),
  ])
}

export function addTag({ bookmarkId, newTag }) {
  return mongoApp().callFunction('addTag', [
    newTag,
    new BSON.ObjectId(bookmarkId),
  ])
}

export function removeTag({ bookmarkId, tagToRemove }) {
  return mongoApp().callFunction('removeTag', [
    tagToRemove,
    new BSON.ObjectId(bookmarkId),
  ])
}

export async function loadUserData({ userId }) {
  return await mongoCollection('user_data').findOne({ owner_id: userId })
}

export function markBookmarksImported({ userId }) {
  return mongoCollection('user_data').updateOne(
    { owner_id: userId },
    { $set: { is_chrome_imported: true } },
    { upsert: true }
  )
}

export function searchBookmarks({ query, num, skip, site, tags }) {
  return mongoApp()
    .callFunction('searchBookmarksV2', [query, num, skip, site, tags])
    .then((resp) => {
      for (const doc of resp.bookmarks) {
        doc.id = doc._id.toString()
      }
      return resp
    })
}
