import { watch } from 'vue'

export const getAuthGuard = (auth) => (to, from, next) => {
  const fn = () => {
    let requiredAuthState = to.meta.requiredAuthState
    let currentAuthState = auth.isAuthenticated ? 'login' : 'logout'

    if (currentAuthState === requiredAuthState) {
      return next()
    }

    if (requiredAuthState === 'login') {
      return next({ name: 'landing', replace: true })
    }

    return next({ name: 'app', replace: true })
  }

  if (!auth.loading.value) {
    return fn()
  }

  watch(auth.loading, (loading) => {
    if (loading === false) {
      return fn()
    }
  })
}
