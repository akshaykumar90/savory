import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    routes: [
      { path: '/tag/:tag', component: require('../App.vue') },
      { path: '/site/:site', component: require('../App.vue') },
      { path: '/q/:query', component: require('../App.vue') },
      { path: '/', component: require('../App.vue') }
    ]
  })
}
