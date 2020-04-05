import {CustomCredential, Stitch} from 'mongodb-stitch-browser-sdk'
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk'

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
const bookmarksCountCollection = mongoClient.db('savory').collection('bookmarks_count')

export async function onLogin ({ token }) {
  if (!auth.isLoggedIn) {
    console.log('[stitch] login')
    await auth.loginWithCredential(new CustomCredential(token))
  }
}

export async function onLogout () {
  if (auth.isLoggedIn) {
    console.log('[stitch] logout')
    await auth.logout()
  }
}

export async function importBookmarks (chunk) {
  const userId = auth.user.identities[0].id
  for (const bookmark of chunk) {
    bookmark.owner_id = userId
  }
  await bookmarksCollection.insertMany(chunk)
}

export function fetchRecent (num) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection.find({ owner_id: userId }, { limit: num, sort: { dateAdded: -1 }}).toArray()
}

export function getCount () {
  const userId = auth.user.identities[0].id
  return bookmarksCountCollection.findOne( { owner_id: userId })
}

export function setCount (newCount) {
  const userId = auth.user.identities[0].id
  return bookmarksCountCollection.updateOne(
    { owner_id: userId },
    { $set: { count: newCount }},
    { upsert: true }
  )
}

export async function createBookmark (bookmark) {
  const userId = auth.user.identities[0].id
  bookmark.owner_id = userId
  await bookmarksCollection.insertOne(bookmark)
}

export async function deleteBookmark (chromeId) {
  const userId = auth.user.identities[0].id
  await bookmarksCollection.deleteOne({ owner_id: userId, chrome_id: chromeId })
}

async function updateTags(chromeId, modifyFn) {
  const userId = auth.user.identities[0].id
  let bookmark = await bookmarksCollection.findOne({ owner_id: userId, chrome_id: chromeId })
  let updatedTags = modifyFn(bookmark.tags)
  await bookmarksCollection.updateOne(
    { owner_id: userId, chrome_id: chromeId },
    { $set: { tags: updatedTags } }
  )
  return { tags: updatedTags }
}

export function addNewTags (chromeId, newTags) {
  return updateTags(chromeId, existingTags => {
    let tagsList = [...existingTags, ...newTags]
    return [...new Set(tagsList)]
  })
}

export function removeTag (chromeId, tagToRemove) {
  // Tag names are unique, so we can filter by value
  return updateTags(chromeId, existingTags => {
    return existingTags.filter(t => t !== tagToRemove)
  })
}

export function fetchBookmarksWithTag (tag) {
  const userId = auth.user.identities[0].id
  return bookmarksCollection.find(
    { owner_id: userId, tags: tag },
    { projection: { chrome_id: 1 }, sort: { dateAdded: -1 } },
  ).toArray()
}

export { mongoApp }
