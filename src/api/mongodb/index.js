import * as service from './service'
import { getAuthWrapper } from '../../auth'

function injectUserId(func) {
  return new Proxy(func, {
    apply(target, thisArg, args) {
      let firstArg = args.length > 0 ? args[0] : {}
      const authService = getAuthWrapper()
      if (!authService.user) {
        return Promise.reject('Not logged in!')
      } else {
        firstArg.userId = authService.user.identities[0].id
      }
      return Reflect.apply(func, thisArg, [firstArg])
    },
  })
}

export const importBookmarks = injectUserId(service.importBookmarks)
export const fetchRecent = injectUserId(service.fetchRecent)
export const getBookmarksWithTag = injectUserId(service.getBookmarksWithTag)
export const getTagsCount = injectUserId(service.getTagsCount)
export const getCount = injectUserId(service.getCount)
export const createBookmark = injectUserId(service.createBookmark)
export const deleteBookmarks = injectUserId(service.deleteBookmarks)
export const addTag = injectUserId(service.addTag)
export const removeTag = injectUserId(service.removeTag)
export const loadUserData = injectUserId(service.loadUserData)
export const markBookmarksImported = injectUserId(service.markBookmarksImported)
export const searchBookmarks = injectUserId(service.searchBookmarks)
