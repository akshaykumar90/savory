import Vue from 'vue'
import Vuex from 'vuex'
import bookmarks from './modules/bookmarks'
import list from './modules/list'
import browser from './modules/browser'

Vue.use(Vuex)

function createStore() {
  return new Vuex.Store({
    modules: {
      bookmarks,
      list,
      browser,
    },
  })
}

export const store = createStore()
