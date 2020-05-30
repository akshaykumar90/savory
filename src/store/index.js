import Vue from 'vue'
import Vuex from 'vuex'
import actions from './actions'
import mutations from './mutations'
import getters from './getters'

Vue.use(Vuex)

function createStore() {
  return new Vuex.Store({
    state: {
      activeType: 'new',
      itemsPerPage: 100,
      page: 1,
      bookmarks: {
        /* [id: number]: Bookmark */
      },
      tags: {
        /* [name: string]: number */
      },
      numBookmarks: 0,
      lists: {
        new: [
          /* number */
        ],
        filtered: [],
        selected: []
      },
      filter: {
        active: [
          /* { type: string, name: string } */
        ],
        items: [
          /* number */
        ]
      },
      importPercent: 0
    },
    actions,
    mutations,
    getters
  })
}

export const store = createStore()
