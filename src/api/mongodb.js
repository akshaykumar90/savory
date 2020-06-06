import {
  CustomCredential,
  RemoteMongoClient,
  Stitch,
} from 'mongodb-stitch-browser-sdk'

import { app_id } from '../stitch/stitch.json'

const mongoApp = Stitch.hasAppClient(app_id)
  ? Stitch.getAppClient(app_id)
  : Stitch.initializeAppClient(app_id)

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
  await bookmarksCollection.insertMany(chunk)
}

export function saveChromeUpdates(mutations) {
  const userId = auth.user.identities[0].id
  for (const mut of mutations) {
    mut.owner_id = userId
  }
  return chromeMutationsCollection.insertMany(mutations)
}

export function fetchRecent(num) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection
    .find({ owner_id: userId }, { limit: num, sort: { dateAdded: -1 } })
    .toArray()
}

export function getCount() {
  const userId = auth.user.identities[0].id
  return bookmarksCountCollection.findOne({ owner_id: userId })
}

export function setCount(newCount) {
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
  await bookmarksCollection.insertOne(bookmark)
}

export async function deleteBookmark(chromeId) {
  const userId = auth.user.identities[0].id
  await bookmarksCollection.deleteOne({ owner_id: userId, chrome_id: chromeId })
}

export function addTag(chromeId, newTag) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection.updateOne(
    { owner_id: userId, chrome_id: chromeId },
    { $addToSet: { tags: newTag } }
  )
}

export function removeTag(chromeId, tagToRemove) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection.updateOne(
    { owner_id: userId, chrome_id: chromeId },
    { $pullAll: { tags: [tagToRemove] } }
  )
}

export function fetchBookmarksWithTag(tag) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection
    .find(
      { owner_id: userId, tags: tag },
      { projection: { chrome_id: 1 }, sort: { dateAdded: -1 } }
    )
    .toArray()
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
