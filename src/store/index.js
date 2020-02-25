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
      itemsPerPage: 100,
      page: 1,
      bookmarks: {/* [id: number]: Bookmark */},
      numBookmarks: 0,
      listicles: {/* [id: string]: Listicle */},
      lists: {
        new: [/* number */],
        filtered: [],
      },
      filter: {
        active: [/* { type: string, name: string } */],
        items: [/* number */],
      },
      activeListicleId: null
    },
    actions,
    mutations,
    getters
  })
}
