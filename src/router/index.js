import Vue from 'vue'
import Router from 'vue-router'
import BookmarkList from '../components/BookmarkList.vue'
import AppLayout from '../layouts/AppLayout.vue'
import LandingPage from '../pages/LandingPage.vue'
import SignupPage from '../pages/SignupPage.js'
import NotFound from '../pages/NotFound.vue'
import { authGuard } from '../auth'
import { store } from '../store'
import OnboardingLayout from '../layouts/OnboardingLayout.vue'
import OnboardingSaveLink from '../pages/onboarding/SaveLink.vue'
import OnboardingAddTags from '../pages/onboarding/AddTags.vue'
import OnboardingFilterTags from '../pages/onboarding/FilterTags.vue'
import OnboardingNeedHelp from '../pages/onboarding/NeedHelp.vue'
import OnboardingInstallExtension from '../pages/onboarding/InstallExtension.vue'

Vue.use(Router)

function getOnboardingRoutes() {
  let routes = []
  const screens = [
    OnboardingSaveLink,
    OnboardingAddTags,
    OnboardingFilterTags,
    OnboardingNeedHelp,
    OnboardingInstallExtension,
  ]
  screens.forEach((item, index) => {
    let path = index === 0 ? '/welcome' : `/welcome/${index + 1}`
    routes.push({
      path: path,
      name: item.name,
      component: item,
      beforeEnter: authGuard,
      meta: {
        layout: OnboardingLayout,
        requiredAuthState: 'login',
      },
    })
  })
  return routes
}

const onboardingRoutes = getOnboardingRoutes()

function createRouter() {
  return new Router({
    mode: 'history',
    // Vue Router ensures that the Vue.$route variable is updated before
    // scrollBehavior is called to scroll into position. This lets us use
    // Async Scrolling here by waiting on the fetch promise that is set on a
    // watch on the $route variable.
    scrollBehavior(to, from, savedPosition) {
      if (store.state.list.fetchPromise) {
        return store.state.list.fetchPromise.then(() => {
          if (savedPosition) {
            return savedPosition
          } else {
            return { y: 0 }
          }
        })
      }
      if (savedPosition) {
        return savedPosition
      } else {
        return { y: 0 }
      }
    },
    routes: [
      {
        path: '/provider_cb',
        name: 'provider_cb',
        beforeEnter: (to, from, next) => {
          next({ name: 'welcome' })
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
        path: '*',
        name: '404',
        component: NotFound,
      },
    ],
  })
}

export const router = createRouter()
