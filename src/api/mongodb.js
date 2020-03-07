import { Stitch } from 'mongodb-stitch-browser-sdk'
import { RemoteMongoClient } from 'mongodb-stitch-browser-sdk'

const APP_ID = 'savory-backend-ailsq'

const mongoApp = Stitch.hasAppClient(APP_ID)
    ? Stitch.getAppClient(APP_ID)
    : Stitch.initializeAppClient(APP_ID);

const mongoClient = mongoApp.getServiceClient(
    RemoteMongoClient.factory,
    'savorydb'
)

const bookmarksCollection = mongoClient.db('savory').collection('bookmarks')
const bookmarksCountCollection = mongoClient.db('savory').collection('bookmarks_count')

export async function importBookmarks (userId, chunk) {
    for (const bookmark of chunk) {
        bookmark.owner_id = userId
    }
    await bookmarksCollection.insertMany(chunk)
}

export function fetchRecent (userId, num) {
    return bookmarksCollection.find({ owner_id: userId }, { limit: num, sort: { dateAdded: -1 }}).toArray()
}

export function getCount (userId) {
    return bookmarksCountCollection.findOne( { owner_id: userId })
}

export function setCount (userId, newCount) {
    return bookmarksCountCollection.updateOne(
        { owner_id: userId },
        { $set: { count: newCount }},
        { upsert: true }
    )
}

export async function createBookmark (userId, bookmark) {
    bookmark.owner_id = userId
    await bookmarksCollection.insertOne(bookmark)
}

export async function deleteBookmark (userId, chromeId) {
    await bookmarksCollection.deleteOne({ owner_id: userId, chrome_id: chromeId })
}

async function updateTags(userId, chromeId, modifyFn) {
    let bookmark = await bookmarksCollection.findOne({ owner_id: userId, chrome_id: chromeId })
    let updatedTags = modifyFn(bookmark.tags)
    await bookmarksCollection.updateOne(
        { owner_id: userId, chrome_id: chromeId },
        { $set: { tags: updatedTags } }
    )
    return { tags: updatedTags }
}

export function addNewTags (userId, chromeId, newTags) {
    return updateTags(userId, chromeId, existingTags => {
        let tagsList = [...existingTags, ...newTags]
        return [...new Set(tagsList)]
    })
}

export function removeTag (userId, chromeId, tagToRemove) {
    // Tag names are unique, so we can filter by value
    return updateTags(userId, chromeId, existingTags => {
        return existingTags.filter(t => t !== tagToRemove)
    })
}

export function fetchBookmarksWithTag (userId, tag) {
    return bookmarksCollection.find(
        { owner_id: userId, tags: tag },
        { projection: { chrome_id: 1 }, sort: { dateAdded: -1 } },
    ).toArray()
}

export { mongoApp }
