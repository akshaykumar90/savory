import moment from 'moment'
import { authWrapper } from './auth'
import { browser, importBrowserBookmarks } from './api/browser'
import { clientConfig } from './api/backend'
import { Client } from './api/backend/client'

const welcome_page_url = 'https://app.getsavory.co/welcome'

const auth = authWrapper({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  backendClientConfig: clientConfig,
  background: true,
})

window.ApiClient = new Client(auth, clientConfig)

/**
 * This is the real event handler for listening to Chrome's bookmark created
 * events. We ignore any events with an old (more than 10 seconds ago) timestamp
 * to avoid getting stuck in the event storm related to the sporadic reshuffling
 * which Chrome does sometimes.
 *
 * Notably, we do not handle Chrome's bookmark removed events. There are a
 * few reasons for this: 1) We do not have a way to distinguish between real
 * user-initiated events vs. events originating from Chrome shuffle. We cannot
 * use the dateAdded timestamp similar to created events. 2) Even if we were
 * able to reliably follow the event storm resulting from Chrome's shuffling of
 * bookmarks, we would actually lose any tags stored on the bookmarks being
 * deleted. :( 3) We already have a delete button in Savory and it's probably a
 * good idea to decouple from Chrome as much as possible.
 *
 * Eventually, we will roll out our own popup for adding/removing bookmarks from
 * the browser's UI so that we can support adding tags right when we add a
 * bookmark (and to have more control over the behavior in general). This will
 * make this event handler and its associated hacks unnecessary.
 */
browser.bookmarks.onCreated.addListener(async (__, bookmark) => {
  const { title, url, dateAdded } = bookmark
  if (!url) {
    return
  }
  if (moment(dateAdded).isAfter(moment().subtract(10, 'seconds'))) {
    const savoryBookmark = {
      title,
      url,
      dateAdded,
      tags: [],
    }
    let dbBookmark = await ApiClient.createBookmark({
      bookmark: savoryBookmark,
    })
    browser.runtime.sendMessage({
      type: 'ON_BOOKMARK_CREATED',
      bookmark: dbBookmark,
    })
  }
})

function onMessage(request, sender, sendResponse) {
  const { type, ...args } = request
  if (type === 'login') {
    const { token } = args
    auth.silentLogin(token)
  } else if (type === 'logout') {
    auth.silentLogout()
  } else if (type === 'test') {
    sendResponse(true)
  }
}

function onImportBookmarksMessage(port, attempt) {
  if (!auth.isAuthenticated()) {
    if (attempt === 15) {
      return Promise.reject('Not logged in.')
    }
    console.log('Not logged in yet... sleeping for 1s.')
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Woke!')
        resolve(onImportBookmarksMessage(port, attempt + 1))
      }, 1000)
    })
  }
  return importBrowserBookmarks(({ percent }) => {
    port.postMessage({ percent })
  })
}

browser.runtime.onMessageExternal.addListener(onMessage)

browser.runtime.onConnectExternal.addListener(function (port) {
  console.assert(port.name === 'import_bookmarks')
  port.onMessage.addListener(async function ({ token }) {
    if (!auth.isAuthenticated()) {
      auth.silentLogin(token)
    }
    await onImportBookmarksMessage(port, 1)
  })
})

browser.browserAction.onClicked.addListener(() => {
  if (!auth.isAuthenticated()) {
    auth.loginWithPopup()
  } else {
    console.log('Already logged in...')
  }
})

browser.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    browser.tabs.create({ url: welcome_page_url })
  }
})
