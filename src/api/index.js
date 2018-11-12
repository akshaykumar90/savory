import idb from 'idb';

const dbPromise = idb.open('savory', 1, upgradeDB => {
  console.log('making a new object store');
  const tagsOS = upgradeDB.createObjectStore('tags', {keyPath: 'id'});
  tagsOS.createIndex('tagName', 'tags', { unique: false, multiEntry: true })
});

// Retrieves the recently added bookmarks
// https://developer.chrome.com/extensions/bookmarks#method-getRecent
export function fetchRecent (num) {
  return new Promise(resolve => chrome.bookmarks.getRecent(num, resolve))
}

export function fetchTagsForBookmarkIds (ids) {
  return dbPromise.then(db => {
    const tx = db.transaction('tags', 'readonly');
    const store = tx.objectStore('tags');
    return store.getAll();
  });
}

export function addNewTagForBookmark ({ id, tag }) {
  return dbPromise.then(async db => {
    const tx = db.transaction('tags', 'readwrite');
    const store = tx.objectStore('tags');
    let tagsObj = await store.get(id) || { id, tags: [] };
    if (!tagsObj.tags.includes(tag)) {
      tagsObj.tags.push(tag);
    }
    store.put(tagsObj);
    await tx.complete;
    return db.transaction('tags').objectStore('tags').get(id);
  })
}
