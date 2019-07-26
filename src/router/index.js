import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

function createRouter () {
  return new Router({
    routes: [
      { path: '/filter/:filter*', name: 'filter', component: require('../App.vue') },
      { path: '/list/:list', name: 'list', component: require('../App.vue') },
      { path: '/', name: 'home', component: require('../App.vue') }
    ]
  })
}

export const router = createRouter()
