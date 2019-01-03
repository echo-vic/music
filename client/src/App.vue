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
  computed: mapState('main', ['loading', 'user']),
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
    // this.checkVersion()
    // get local storage app version
    // get serveur app version
    // if !== ==> window.location.reload(true)
  }
}
</script>

<style>
@media only screen and (min-device-width : 375px) and (max-device-width : 812px) and (-webkit-device-pixel-ratio : 3) {
    .q-tabs-head {
      padding-bottom: 10px !important;
    }
  }
  .q-rating {
    color: #f57f17 !important;
  }
  .q-rating i {
    text-shadow: none;
  }
  .q-tabs-inverted .q-tabs-head{
    background-color: rgba(255, 255, 255, 0.95)
  }
  .q-tabs-scroller {
    color: #444
  }
  hr {
    height: 1px;
    padding: 0;
    background-color: #aaa;
    border: 0;
  }
  .search-page {
    background-color: #F5F5F5;
  }
  .search-page .q-item-letter {
    position: absolute;
    top: 0;
    right: 0;
    border-radius: 0px 3px 0px 0px;
    background: #616161 !important;
    padding: 3px 5px;
    font-size: 12px;
    color: #fff;
  }
  .search-page .q-collapsible-sub-item {
    background-color: #FAFAFA;
    border-top: 1px solid rgba(0,0,0,0.1)
  }
  .search-page .q-list {
    padding: 0;
    border: none;
  }
  .search-page .q-item-side {
    overflow: hidden;
  }
  .search-page .q-item-main {
    margin-left: -20px;
  }
  .search-page .q-item-side img {
    height: 80px;
    widows: 80px;
    object-fit: contain;
    object-position: left;
  }
  .search-page .q-collapsible {
    margin-bottom: 10px;
  }
  .search-page .q-collapsible-inner {
    background-color: #fff;
  }
  .search-page .q-collapsible-cursor-pointer > .q-collapsible-inner > .q-item {
    padding: 0 !important;
  }
  .search-page .q-collapsible-cursor-pointer > .q-collapsible-inner > .q-item img {
    display: block;
  }
</style>
