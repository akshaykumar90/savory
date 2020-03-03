import {
    createBookmark,
    deleteBookmark
} from './api/mongodb'

chrome.runtime.onInstalled.addListener(function() {
    console.log('Background script active!!')
})

function setupListeners (callback) {
    // https://developer.chrome.com/extensions/bookmarks#event-onCreated
    chrome.bookmarks.onCreated.addListener((id, bookmark) => callback({
        type: 'ON_BOOKMARK_CREATED',
        bookmark
    }))
    // https://developer.chrome.com/extensions/bookmarks#event-onRemoved
    chrome.bookmarks.onRemoved.addListener((id, { node }) => callback({
        type: 'ON_BOOKMARK_REMOVED',
        bookmark: node
    }))
}

setupListeners(async function ({ type, bookmark }) {
    const userId = 'test1'
    console.log('inside callback')
    if (type === 'ON_BOOKMARK_CREATED') {
        const { id, title, url, dateAdded } = bookmark
        await createBookmark(userId, { chrome_id: id, title, url, dateAdded, tags: [] })
        chrome.runtime.sendMessage({ type: 'ON_BOOKMARK_CREATED', bookmark })
    } else if (type === 'ON_BOOKMARK_REMOVED') {
        await deleteBookmark(userId, bookmark.id)
        chrome.runtime.sendMessage({ type: 'ON_BOOKMARK_REMOVED', bookmark })
    }
})
