import { BSON, RemoteMongoClient } from 'mongodb-stitch-browser-sdk'
import { getAuthWrapper } from '../../auth'
import _ from 'lodash'

const mongoCollection = _.memoize((name) => {
  const authService = getAuthWrapper()
  const mongoClient = authService
    .getMongoApp()
    .getServiceClient(RemoteMongoClient.factory, 'savorydb')
  const proxyService = createStitchCollectionProxy(
    mongoClient.db('savory').collection(name)
  )
  return authService.withAuthHandling(proxyService)
})

const mongoApp = () => getAuthWrapper().getMongoApp()

/**
 * This function is only needed because `collection.find` does not return a
 * promise.
 *
 * All Stitch API function calls must return a promise to be properly observed
 * by the auth service for expired tokens.
 *
 * @param realCollection: The mongo collection object to wrap
 */
function createStitchCollectionProxy(realCollection) {
  const target = {}
  target.find = (...args) => realCollection.find(...args).toArray()
  let restOfTheMethods = [
    'findOne',
    'insertOne',
    'insertMany',
    'updateOne',
    'deleteOne',
  ]
  restOfTheMethods.forEach((item) => {
    const origMethod = realCollection[item]
    target[item] = (...args) => origMethod.apply(realCollection, args)
  })
  return target
}

export async function importBookmarks({ chunk }) {
  return mongoApp().callFunction('importBookmarks', [chunk])
}

export function fetchRecent({ userId, num }) {
  return mongoCollection('bookmarks')
    .find({ owner_id: userId }, { limit: num, sort: { dateAdded: -1 } })
    .then((bookmarks) => {
      for (const bookmark of bookmarks) {
        bookmark.id = bookmark._id.toString()
      }
      return bookmarks
    })
}

export function getBookmarksWithTag({ tags, site }) {
  return mongoApp()
    .callFunction('getBookmarksWithTag', [{ tags, site }])
    .then((result) => {
      for (const doc of result) {
        doc.id = doc._id.toString()
      }
      return result
    })
}

export async function getTagsCount() {
  let result = await mongoApp().callFunction('getTagsCount')
  return result.map(({ tag_name: tagName, count }) => ({ tagName, count }))
}

// todo: can be removed
export function getCount({ userId }) {
  return mongoCollection('bookmarks_count').findOne({ owner_id: userId })
}

// todo: can be removed
export function setCount({ userId, newCount }) {
  return mongoCollection('bookmarks_count').updateOne(
    { owner_id: userId },
    { $set: { count: newCount } },
    { upsert: true }
  )
}

export async function createBookmark({ bookmark }) {
  return mongoApp()
    .callFunction('addBookmark', [bookmark])
    .then((result) => {
      result.id = result._id.toString()
      return result
    })
}

export async function deleteBookmark({ bookmarkId }) {
  return mongoApp().callFunction('deleteBookmarks', [
    [new BSON.ObjectId(bookmarkId)],
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

export async function searchBookmarks({ userId, query }) {
  let response = await mongoApp().callFunction('searchBookmarksV2', [
    query,
    100,
  ])
  return response.results.map(({ _id }) => _id.toString())
}
