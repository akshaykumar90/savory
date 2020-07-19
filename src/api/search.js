import { mongoApp } from './mongodb'

export async function searchBookmarks(query) {
  const userId = mongoApp.auth.user.identities[0].id
  let results = await mongoApp.callFunction('searchBookmarks', [userId, query])
  return results.map(({ _id }) => _id.toString())
}

let currRequestId = 0

export function incrementAndGet() {
  return ++currRequestId
}

export function isRequestSuperseded(requestId) {
  return requestId < currRequestId
}
