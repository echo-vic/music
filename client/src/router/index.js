import Vue from 'vue'
// import store from './../store/main'
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

  Router.afterEach((to, from) => {
    console.log('Router.afterEach')
    if (localStorage.getItem('userId') && localStorage.getItem('token') && localStorage.getItem('userEmail')) {
      console.log('ok all localstorage !!!!!!!!!!!!!!!!!!!')
    } else {
      Router.push({
        name: 'connect'
      })
    }
  })
  /* Router.beforeEach((to, from, next) => {
    if (localStorage.getItem('userId') && localStorage.getItem('token') && localStorage.getItem('userEmail')) {
      console.log('ok all localstorage !!!!!!!!!!!!!!!!!!!')
      next()
    } else {
      console.log('KO REDIRECT !!!!!!')
      next('/connect')
    }
  }) */

  return Router
}
