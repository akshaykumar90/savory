import Vuex from 'vuex'

export function createStore() {
  return new Vuex.Store({
    state: {
      list: {
        activeType: 'new',
        filter: {
          active: [
            /* { type: string, name: string } */
          ],
          total: 0,
        },
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
          id: '1',
          title:
            "A long long loooooong bookmark title which just continues marching towards the right like there's no tomorrow",
          url: 'https://savory.test',
          site: 'savory.test',
          tags: ['small', 'long tag with spaces'],
        }
      },
    },
  })
}
