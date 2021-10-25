import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import SignupPage from '../pages/SignupPage.js'
import NotFound from '../pages/NotFound.vue'
import { getAuthGuard } from '../auth'
import { getOnboardingRoutes } from '../lib/onboarding'
import LoginCallback from '../pages/LoginCallback'

export const getRouter = (auth) => {
  const authGuard = getAuthGuard(auth)
  const onboardingRoutes = getOnboardingRoutes()
  onboardingRoutes.forEach((r) => {
    r.beforeEnter = authGuard
  })

  return createRouter({
    history: createWebHistory(),
    routes: [
      {
        path: '/provider_cb',
        name: 'provider_cb',
        component: LoginCallback,
      },
      {
        path: '/logout',
        name: 'logout',
        beforeEnter: (to, from, next) => {
          next({ name: 'landing' })
        },
      },
      ...onboardingRoutes,
      {
        path: '/',
        name: 'home',
        component: LandingPage,
        beforeEnter: authGuard,
        meta: {
          requiredAuthState: 'login',
        },
      },
      {
        path: '/landing',
        name: 'landing',
        component: LandingPage,
        beforeEnter: authGuard,
        meta: {
          requiredAuthState: 'logout',
        },
      },
      {
        path: '/signup',
        name: 'signup',
        component: SignupPage,
        beforeEnter: authGuard,
        meta: {
          requiredAuthState: 'logout',
        },
      },
      {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: NotFound,
      },
    ],
  })
}
