<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import Api from './services/Api'
import { mapState } from 'vuex'
import { Loading } from 'quasar'
export default {
  name: 'App',
  computed: mapState('main', ['loading']),
  watch: {
    loading: function (val) {
      if (val) {
        Loading.show()
      } else {
        Loading.hide()
      }
    }
  },
  methods: {
    checkVersion () {
      Api().get('version')
        .then(resp => {
          let serverVersion = resp.data.version
          let localVersion = localStorage.version
          console.log('VERSION =>', serverVersion, localVersion)
          if (!localVersion) {
            localStorage.setItem('version', serverVersion)
            window.location.reload(true)
          }
          if (serverVersion.toString() !== localVersion.toString()) {
            localStorage.setItem('version', serverVersion)
            window.location.reload(true)
          }
        })
    }
  },
  mounted () {
    this.checkVersion()
    // get local storage app version
    // get serveur app version
    // if !== ==> window.location.reload(true)
  }
}
</script>

<style>
</style>
