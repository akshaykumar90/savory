import { createRouter, createWebHistory } from 'vue-router'
import LandingPage from '../pages/LandingPage.vue'
import BookmarksPage from '../pages/BookmarksPage.vue'
import TagsPage from '../pages/TagsPage.vue'
import SignupPage from '../pages/SignupPage.vue'
import NotFound from '../pages/NotFound.vue'
import { useAuth } from '../auth'
import LoginCallback from '../pages/LoginCallback.vue'
import AppLayout from '../layouts/AppLayout.vue'
import { usePageStore } from '../stores/page'

const bookmarksPageScrollBehavior = (savedPosition) => {
  const store = usePageStore()
  return store.fetchPromise.then(() => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  })
}

export const getRouter = () => {
  const { authGuard } = useAuth()

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
        component: BookmarksPage,
        beforeEnter: authGuard,
        meta: {
          layout: AppLayout,
          requiredAuthState: 'login',
          customScrollBehavior: bookmarksPageScrollBehavior,
        },
      },
      {
        path: '/tags',
        name: 'tags',
        component: TagsPage,
        beforeEnter: authGuard,
        meta: {
          layout: AppLayout,
          requiredAuthState: 'login',
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
