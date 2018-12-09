import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    routes: [
      { path: '/tag/:tag', name: 'tag', component: require('../App.vue') },
      { path: '/site/:site', name: 'site', component: require('../App.vue') },
      { path: '/q/:query', name: 'search', component: require('../App.vue') },
      { path: '/', name: 'home', component: require('../App.vue') }
    ]
  })
}
