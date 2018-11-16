import Vue from 'vue'
import VueRouter from 'vue-router'
import Spotify from 'spotify-web-api-node'
import VueSpotify from 'vue-spotify'

import routes from './routes'

Vue.use(VueRouter)
Vue.use(VueSpotify, new Spotify())

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    scrollBehavior: () => ({ y: 0 }),
    routes,

    // Leave these as is and change from quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    mode: process.env.VUE_ROUTER_MODE,
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}
