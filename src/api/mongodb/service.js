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

export async function importBookmarks({ userId, chunk }) {
  for (const bookmark of chunk) {
    bookmark.owner_id = userId
  }
  return mongoCollection('bookmarks').insertMany(chunk)
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

export function getCount({ userId }) {
  return mongoCollection('bookmarks_count').findOne({ owner_id: userId })
}

export function setCount({ userId, newCount }) {
  return mongoCollection('bookmarks_count').updateOne(
    { owner_id: userId },
    { $set: { count: newCount } },
    { upsert: true }
  )
}

export async function createBookmark({ userId, bookmark }) {
  bookmark.owner_id = userId
  let result = await mongoCollection('bookmarks').insertOne(bookmark)
  return mongoCollection('bookmarks')
    .findOne({ _id: result.insertedId })
    .then((bookmark) => {
      bookmark.id = bookmark._id.toString()
      return bookmark
    })
}

export async function deleteBookmark({ bookmarkId }) {
  return mongoCollection('bookmarks').deleteOne({
    _id: new BSON.ObjectId(bookmarkId),
  })
}

export function addTag({ bookmarkId, newTag }) {
  return mongoCollection('bookmarks').updateOne(
    { _id: new BSON.ObjectId(bookmarkId) },
    { $addToSet: { tags: newTag } }
  )
}

export function removeTag({ bookmarkId, tagToRemove }) {
  return mongoCollection('bookmarks').updateOne(
    { _id: new BSON.ObjectId(bookmarkId) },
    { $pullAll: { tags: [tagToRemove] } }
  )
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
  let results = await mongoApp().callFunction('searchBookmarks', [
    userId,
    query,
  ])
  return results.map(({ _id }) => _id.toString())
}