import moment from 'moment'
import { authWrapper } from './auth'
import { addXsrfHeader, browser, importBrowserBookmarks } from './api/browser'
import { clientConfig } from './api/backend'
import { Client } from './api/backend/client'

// Redirect user to the webapp homepage instead of `/welcome` on extension
// install. Otherwise, we "risk" walking the user through the onboarding
// workflow again.
//
// Why? Because the onboarding workflow has the hook to prompt user to install
// the extension. So if they have just installed the extension, it's likely they
// went through those screens just a few seconds ago.
//
// Note that the user may have found the extension organically from the chrome
// web store. In that case, we _do_ want them to go through the onboarding
// workflow. That still works. Not hardcoding the `/welcome` route here gives
// router the flexibility to consult the backend to decide whether to show
// onboarding to users.
const welcome_page_url = 'https://app.getsavory.co/'

const auth = authWrapper({
  domain: process.env.AUTH0_DOMAIN,
  clientId: process.env.AUTH0_CLIENTID,
  audience: process.env.AUTH0_AUDIENCE,
  backendClientConfig: clientConfig,
  background: true,
})

window.ApiClient = new Client(auth, clientConfig, addXsrfHeader)

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
    await ApiClient.createBookmark({
      bookmark: {
        title,
        url,
        date_added: dateAdded,
        tags: [],
      },
    })
  }
})

function onMessage(request, sender, sendResponse) {
  const { type, ...args } = request
  if (type === 'login') {
    const { userId } = args
    auth.silentLogin(userId)
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
  port.onMessage.addListener(async function ({ userId }) {
    if (!auth.isAuthenticated()) {
      auth.silentLogin(userId)
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
