import Vue from 'vue'
import Router from 'vue-router'
import BookmarkList from '../components/BookmarkList.vue'
import AppLayout from '../layouts/AppLayout.vue'

Vue.use(Router)

function createRouter () {
  return new Router({
    mode: 'history',
    fallback: false,
    routes: [
      {
        path: '/filter/:filter*',
        name: 'filter',
        component: BookmarkList,
        meta: {
          layout: AppLayout
        }
      },
      {
        path: '/',
        name: 'home',
        component: BookmarkList,
        meta: {
          layout: AppLayout
        }
      },
      {
        path: '/bookmarks.html',
        name: 'home',
        component: BookmarkList,
        meta: {
          layout: AppLayout
        }
      }
    ]
  })
}

export const router = createRouter()
