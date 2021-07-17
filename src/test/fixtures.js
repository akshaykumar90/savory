import Vuex from 'vuex'

export function createStore() {
  return new Vuex.Store({
    state: {
      list: {
        activeType: 'new',
      },
    },
    getters: {
      tagsCount: (state) => {
        return [
          ['hello', 1],
          ['world', 1],
        ]
      },
      getBookmarkById: (state) => () => {
        return {
          id: '1234',
          site: 'savory.test',
          tags: ['small', 'long tag with spaces'],
        }
      },
    },
  })
}
