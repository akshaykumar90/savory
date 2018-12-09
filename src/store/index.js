import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

export function createStore () {
  return new Vuex.Store({
    state: {
      activeType: 'new',
      itemsPerPage: 50,
      page: 1,
      bookmarks: {/* [id: number]: Bookmark */},
      lists: {
        new: [/* number */],
        filtered: [],
      },
      filters: [/* string */]
    },
    actions,
    mutations,
    getters
  })
}
