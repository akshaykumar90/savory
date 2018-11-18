import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export function createRouter () {
  return new Router({
    routes: [
      { path: '/tag/:tag', component: require('../App.vue') },
    ]
  })
}
