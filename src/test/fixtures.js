import Vuex from 'vuex'

export function createStore() {
  return new Vuex.Store({
    getters: {
      tagsCount: () => {
        return [
          ['hello', 1],
          ['world', 1],
        ]
      },
    },
  })
}
