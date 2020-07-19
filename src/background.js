import {
  createBookmark,
  onLogin as mongoAppLogin,
  onLogout as mongoAppLogout,
  saveChromeUpdates,
} from './api/mongodb'
import moment from 'moment'
import _ from 'lodash'

/**
 * This class is a hack to work around Chrome's sporadic reshuffling of
 * bookmarks. It practice, it looks like Chrome deletes a bookmark with an old
 * id, and then inserts the same bookmark with a new id. When this happens, it
 * usually happens in bulk with a lot of bookmarks being created and deleted
 * rapidly.
 *
 * We care about this because Savory relies on Chrome bookmark search (see
 * api/index.js). Therefore, we need to keep the ids stored in MongoDB
 * up-to-date with the Chrome-internal ids and reliably relay any updates when
 * they happen. We have lost updates in the past where we have received 1000s of
 * such events in a couple of minutes. This class implements a batching
 * mechanism to record such mutations and store them in MongoDB with a bulk
 * insert request.
 *
 * Worth noting is that we do not actually update the bookmarks in Savory. We
 * are simply storing a log of mutations in the database so that we can recover
 * *manually* when this happens. There are a couple of reasons for this: 1) This
 * is a hack. And we don't want to over-invest in this *fix*. The actual fix is
 * to move away from Chrome search, which is already planned. 2) Stitch SDK does
 * not expose a bulk update request method. Making a ton of requests to MongoDB
 * defeats the purpose of batching and might result in similar data-loss when we
 * are not able to keep up with incoming events.
 */
class EventProcessor {
  constructor() {
    this.urlsCreated = new Map()
    this.urlsDeleted = new Map()
    this.throttledConsume = _.throttle(this.consume, 5000, { leading: false })
  }

  bookmarkCreated(id, url) {
    this.urlsCreated.set(url, id)
  }

  bookmarkRemoved(id, url) {
    this.urlsDeleted.set(url, id)
  }

  consume() {
    const mutations = []
    const matchedUrls = []

    let copyUrlsCreated = new Map(this.urlsCreated)
    let copyUrlsDeleted = new Map(this.urlsDeleted)

    copyUrlsCreated.forEach((new_chrome_id, url) => {
      if (copyUrlsDeleted.has(url)) {
        const old_chrome_id = copyUrlsDeleted.get(url)
        if (new_chrome_id !== old_chrome_id) {
          matchedUrls.push(url)
          mutations.push({ old_chrome_id, new_chrome_id })
        }
      }
    })

    /**
     * Only remove urls that matched in this run. The idea is that urls that
     * were not matched may find a match in the next run. This should therefore
     * reliably record all mutations even when they are split between
     * consecutive time windows.
     *
     * The catch is that the map may grow indefinitely with valid (i.e. user
     * initiated) bookmark created and removed events. That is ok because the
     * background script is automatically suspended after a few seconds of
     * inactivity and therefore that memory should be eventually garbage
     * collected.
     */
    for (const url of matchedUrls) {
      this.urlsCreated.delete(url)
      this.urlsDeleted.delete(url)
    }

    return mutations.length ? saveChromeUpdates(mutations) : Promise.resolve()
  }

  push({ type, id, url }) {
    if (type === 'created') {
      this.bookmarkCreated(id, url)
    } else if (type === 'removed') {
      this.bookmarkRemoved(id, url)
    }
    this.throttledConsume()
  }
}

const ep = new EventProcessor()

chrome.bookmarks.onCreated.addListener((id, { url }) =>
  ep.push({ type: 'created', id, url })
)
chrome.bookmarks.onRemoved.addListener((id, { node: { url } }) =>
  ep.push({ type: 'removed', id, url })
)

/**
 * This is the real event handler for listening to Chrome's bookmark created
 * events. We ignore any events with an old (more than 10 seconds ago) timestamp
 * to avoid getting stuck in the event storm related to the sporadic reshuffling
 * which Chrome does sometimes (see EventProcessor above).
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
    chrome.runtime.sendMessage({ type: 'ON_BOOKMARK_CREATED', dbBookmark })
  }
})

chrome.runtime.onMessage.addListener(({ type, ...args }) => {
  if (type === 'login') {
    mongoAppLogin(args)
  } else if (type === 'logout') {
    mongoAppLogout(args)
  }
})
