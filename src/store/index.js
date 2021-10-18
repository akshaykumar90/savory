import bookmarks from './modules/bookmarks'
import list from './modules/list'
import browser from './modules/browser'
import { createStore } from 'vuex'

export const store = createStore({
  modules: {
    bookmarks,
    list,
    browser,
  },
})
