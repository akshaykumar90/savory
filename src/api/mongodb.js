import {
  CustomCredential,
  RemoteMongoClient,
  Stitch,
  BSON,
} from 'mongodb-stitch-browser-sdk'

import moment from 'moment'

const APP_ID = process.env.STITCH_APP_ID

const mongoApp = Stitch.hasAppClient(APP_ID)
  ? Stitch.getAppClient(APP_ID)
  : Stitch.initializeAppClient(APP_ID)

const { auth } = mongoApp

const mongoClient = mongoApp.getServiceClient(
  RemoteMongoClient.factory,
  'savorydb'
)

const bookmarksCollection = mongoClient.db('savory').collection('bookmarks')
const bookmarksCountCollection = mongoClient
  .db('savory')
  .collection('bookmarks_count')
const userDataCollection = mongoClient.db('savory').collection('user_data')
const chromeMutationsCollection = mongoClient
  .db('savory')
  .collection('chrome_mutations')

export function stitchLoggedIn() {
  if (auth.isLoggedIn) {
    return Promise.resolve()
  } else {
    return new Promise((resolve) =>
      auth.addAuthListener({ onUserLoggedIn: resolve })
    )
  }
}

export async function onLogin({ token }) {
  if (!auth.isLoggedIn) {
    console.log('[stitch] login')
    await auth.loginWithCredential(new CustomCredential(token))
  }
}

export async function onLogout() {
  if (auth.isLoggedIn) {
    console.log('[stitch] logout')
    await auth.logout()
  }
}

export async function importBookmarks(chunk) {
  const userId = auth.user.identities[0].id
  for (const bookmark of chunk) {
    bookmark.owner_id = userId
  }
  return bookmarksCollection.insertMany(chunk)
}

export function saveChromeUpdates(mutations) {
  const userId = auth.user.identities[0].id
  for (const mut of mutations) {
    mut.owner_id = userId
    mut.timestamp = moment.now()
  }
  return chromeMutationsCollection.insertMany(mutations)
}

export function fetchRecent(num) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection
    .find({ owner_id: userId }, { limit: num, sort: { dateAdded: -1 } })
    .toArray()
    .then((bookmarks) => {
      for (const bookmark of bookmarks) {
        bookmark.id = bookmark._id.toString()
      }
      return bookmarks
    })
}

export function getCount() {
  const userId = auth.user.identities[0].id
  return bookmarksCountCollection.findOne({ owner_id: userId })
}

export function setCount(newCount) {
  // FIXME: This check should be done at a common place since it applies to
  //  ~all methods trying to talk to MongoDB.
  if (!auth.isLoggedIn) {
    return Promise.resolve()
  }
  const userId = auth.user.identities[0].id
  return bookmarksCountCollection.updateOne(
    { owner_id: userId },
    { $set: { count: newCount } },
    { upsert: true }
  )
}

export async function createBookmark(bookmark) {
  const userId = auth.user.identities[0].id
  bookmark.owner_id = userId
  let result = await bookmarksCollection.insertOne(bookmark)
  return bookmarksCollection
    .findOne({ _id: result.insertedId })
    .then((bookmark) => {
      bookmark.id = bookmark._id.toString()
      return bookmark
    })
}

export async function deleteBookmark(bookmarkId) {
  return bookmarksCollection.deleteOne({ _id: new BSON.ObjectId(bookmarkId) })
}

export function addTag(bookmarkId, newTag) {
  return bookmarksCollection.updateOne(
    { _id: new BSON.ObjectId(bookmarkId) },
    { $addToSet: { tags: newTag } }
  )
}

export function removeTag(bookmarkId, tagToRemove) {
  return bookmarksCollection.updateOne(
    { _id: new BSON.ObjectId(bookmarkId) },
    { $pullAll: { tags: [tagToRemove] } }
  )
}

export async function loadUserData() {
  const userId = auth.user.identities[0].id
  return await userDataCollection.findOne({ owner_id: userId })
}

export function markBookmarksImported() {
  const userId = auth.user.identities[0].id
  return userDataCollection.updateOne(
    { owner_id: userId },
    { $set: { is_chrome_imported: true } },
    { upsert: true }
  )
}

export { mongoApp }
