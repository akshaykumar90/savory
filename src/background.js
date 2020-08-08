import {
  createBookmark,
  onLogin as mongoAppLogin,
  onLogout as mongoAppLogout,
} from './api/mongodb'
import moment from 'moment'

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
chrome.bookmarks.onCreated.addListener(async (__, bookmark) => {
  const { id, title, url, dateAdded } = bookmark
  if (moment(dateAdded).isAfter(moment().subtract(10, 'seconds'))) {
    let dbBookmark = await createBookmark({
      chrome_id: id,
      title,
      url,
      dateAdded,
      tags: [],
    })
    chrome.runtime.sendMessage({
      type: 'ON_BOOKMARK_CREATED',
      bookmark: dbBookmark,
    })
  }
})

chrome.runtime.onMessage.addListener(({ type, ...args }) => {
  if (type === 'login') {
    mongoAppLogin(args)
  } else if (type === 'logout') {
    mongoAppLogout(args)
  }
})
