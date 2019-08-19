import { openDb } from 'idb';

const dbPromise = openDb('savory', 2, upgradeDB => {
  // Note: we don't use 'break' in this switch statement,
  // the fall-through behaviour is what we want.
  switch (upgradeDB.oldVersion) {
    case 0:
      console.log('Making tags store');
      const tagsOS = upgradeDB.createObjectStore('tags', {keyPath: 'id'});
      tagsOS.createIndex('tagName', 'tags', { unique: false, multiEntry: true })
    case 1:
      console.log('Making lists store');
      const listsOS = upgradeDB.createObjectStore('lists', {keyPath: 'id'});
  }
});

// Retrieves the recently added bookmarks
// https://developer.chrome.com/extensions/bookmarks#method-getRecent
export function fetchRecent (num) {
  return new Promise(resolve => chrome.bookmarks.getRecent(num, resolve))
}

function chromeBookmarksSearch (query) {
  // Find BookmarkTreeNodes matching the given query
  // https://developer.chrome.com/extensions/bookmarks#method-search
  return new Promise(resolve => chrome.bookmarks.search(query, resolve))
}

export async function searchBookmarks (query) {
  let chromeResults = await chromeBookmarksSearch(query)
  const bookmarkIds = chromeResults
    .filter(node => node.hasOwnProperty('url'))
    .map(({ id }) => id)
  return bookmarkIds
}

export function setupListeners (callback) {
  // https://developer.chrome.com/extensions/bookmarks#event-onCreated
  chrome.bookmarks.onCreated.addListener((id, bookmark) => callback({
    type: 'ON_BOOKMARK_CREATED',
    bookmark
  }));
  // https://developer.chrome.com/extensions/bookmarks#event-onRemoved
  chrome.bookmarks.onRemoved.addListener((id, { node }) => callback({
    type: 'ON_BOOKMARK_REMOVED',
    bookmark: node
  }));
}

export function fetchTagsForBookmarkIds (ids) {
  return dbPromise.then(db => {
    const tx = db.transaction('tags', 'readonly');
    const store = tx.objectStore('tags');
    let requests = ids.map(id => store.get(id))
    return Promise.all(requests).then(responses => {
      return responses.filter(resp => resp !== undefined);
    });
  });
}

export function fetchBookmarksWithTag (tag) {
  return dbPromise.then(async db => {
    const tx = db.transaction('tags', 'readonly')
    const store = tx.objectStore('tags')
    let cursor = await store.index('tagName').openCursor(tag, 'prev')
    let bookmarks = []
    while (cursor) {
      bookmarks.push(cursor.value)
      cursor = await cursor.continue()
    }
    return bookmarks
  })
}

export function fetchList (listId) {
  return dbPromise.then(db => {
    return db.transaction('lists').objectStore('lists').get(listId);
  })
}

function updateTags(bookmarkId, modifyFn) {
  return dbPromise.then(async db => {
    const tx = db.transaction('tags', 'readwrite');
    const store = tx.objectStore('tags');
    let tagsObj = await store.get(bookmarkId) || { id: bookmarkId, tags: [] }
    tagsObj.tags = modifyFn(tagsObj.tags)
    store.put(tagsObj);
    await tx.complete;
    return db.transaction('tags').objectStore('tags').get(bookmarkId);
  })
}

export function addNewTagForBookmark ({ id, tags: newTags }) {
  return updateTags(id, existingTags => {
    let tagsList = [...existingTags, ...newTags]
    return [...new Set(tagsList)]
  })
}

export function removeTagFromBookmark ({ id, tag: tagToRemove }) {
  // Tag names are unique, so we can filter by value
  return updateTags(id, existingTags => {
    return existingTags.filter(t => t !== tagToRemove)
  })
}

export function deleteBookmarkTags ({ id }) {
    return dbPromise.then(db => {
      const tx = db.transaction('tags', 'readwrite');
      tx.objectStore('tags').delete(id);
      return tx.complete;
    });
}
