import '../src/assets/app.css'

import Vuex from 'vuex'
import Vue from 'vue'
import { createStore } from '../src/test/fixtures'

Vue.use(Vuex)

Vue.prototype.$store = createStore()

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
}

export const decorators = [
  () => ({
    template:
      '<div class="font-sans bg-default theme-light text-base text-default"><story/></div>',
  }),
]
