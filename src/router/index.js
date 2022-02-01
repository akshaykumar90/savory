import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import BookmarksList from '../pages/BookmarksList.vue'
import SignupPage from '../pages/SignupPage.js'
import NotFound from '../pages/NotFound.vue'
import { getAuthGuard } from '../auth'
import { getOnboardingRoutes } from '../lib/onboarding'
import LoginCallback from '../pages/LoginCallback'
import AppLayout from '../layouts/AppLayout.vue'
import { usePageStore } from '../stores/page'

const bookmarksListScrollBehavior = (savedPosition) => {
  const store = usePageStore()
  return store.fetchPromise.then(() => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  })
}

export const getRouter = (auth) => {
  const authGuard = getAuthGuard(auth)
  const onboardingRoutes = getOnboardingRoutes()
  onboardingRoutes.forEach((r) => {
    r.beforeEnter = authGuard
  })

  return createRouter({
    history: createWebHistory(),
    scrollBehavior(to, from, savedPosition) {
      if (to.meta.customScrollBehavior) {
        return to.meta.customScrollBehavior(savedPosition)
      }
      if (savedPosition) {
        return savedPosition
      } else {
        return { top: 0 }
      }
    },
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
        path: '/',
        alias: ['/tag', '/search'],
        name: 'home',
        component: BookmarksList,
        beforeEnter: authGuard,
        meta: {
          layout: AppLayout,
          requiredAuthState: 'login',
          customScrollBehavior: bookmarksListScrollBehavior,
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
