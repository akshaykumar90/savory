import Vue from 'vue'
import Router from 'vue-router'
import BookmarkList from '../components/BookmarkList.vue'
import AppLayout from '../layouts/AppLayout.vue'
import LandingPage from '../pages/LandingPage.vue'
import WelcomePage from '../pages/WelcomePage.vue'
import { authGuard } from '../auth'

Vue.use(Router)

function createRouter() {
  return new Router({
    mode: 'history',
    scrollBehavior(to, from, savedPosition) {
      if (savedPosition) {
        return savedPosition
      } else {
        return { y: 0 }
      }
    },
    routes: [
      {
        path: '/bookmarks.html',
        name: 'webext-entry',
        beforeEnter: (to, from, next) => {
          next({ name: 'app' })
        },
      },
      {
        path: '/tags/:tag*',
        name: 'tags',
        component: BookmarkList,
        beforeEnter: authGuard,
        meta: {
          layout: AppLayout,
          requiredAuthState: 'login',
        },
      },
      {
        path: '/logout',
        name: 'logout',
        beforeEnter: (to, from, next) => {
          next({ name: 'landing' })
        },
      },
      {
        path: '/',
        name: 'app',
        component: BookmarkList,
        beforeEnter: authGuard,
        meta: {
          layout: AppLayout,
          requiredAuthState: 'login',
        },
      },
      {
        path: '/welcome',
        name: 'welcome',
        component: WelcomePage,
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
    ],
  })
}

export const router = createRouter()
