import { fetchRecent } from '../api'

export default {
  FETCH_BOOKMARKS: ({ commit }, { num }) => {
    fetchRecent(num).then(items => commit('SET_BOOKMARKS', { items }))
  }
}
