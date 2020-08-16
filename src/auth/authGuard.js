import { getAuthWrapper } from './authWrapper'

export const authGuard = (to, from, next) => {
  const authService = getAuthWrapper()

  const fn = () => {
    let requiredAuthState = to.meta.requiredAuthState
    let currentAuthState = authService.isAuthenticated ? 'login' : 'logout'

    if (currentAuthState === requiredAuthState) {
      return next()
    }

    if (requiredAuthState === 'login') {
      return next({ name: 'landing', replace: true })
    }

    return next({ name: 'app', replace: true })
  }

  if (!authService.loading) {
    return fn()
  }

  authService.$watch('loading', (loading) => {
    if (loading === false) {
      return fn()
    }
  })
}
