import {
  createBookmark,
  deleteBookmark,
  onLogin as mongoAppLogin,
  onLogout as mongoAppLogout
} from './api/mongodb'

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
    if (type === 'ON_BOOKMARK_CREATED') {
        const { id, title, url, dateAdded } = bookmark
        await createBookmark({ chrome_id: id, title, url, dateAdded, tags: [] })
        chrome.runtime.sendMessage({ type: 'ON_BOOKMARK_CREATED', bookmark })
    } else if (type === 'ON_BOOKMARK_REMOVED') {
        await deleteBookmark(bookmark.id)
        chrome.runtime.sendMessage({ type: 'ON_BOOKMARK_REMOVED', bookmark })
    }
})

chrome.runtime.onMessage.addListener(({ type, ...args }) => {
  if (type === 'login') {
    mongoAppLogin(args)
  } else if (type === 'logout') {
    mongoAppLogout(args)
  }
})
