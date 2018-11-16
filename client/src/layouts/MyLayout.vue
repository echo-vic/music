<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header>
      <q-toolbar
        color="primary"
        :inverted="$q.theme === 'ios'"
      >
        <q-toolbar-title>
          Cover Choice
          <div slot="subtitle">Bêta</div>
        </q-toolbar-title>
      </q-toolbar>
    </q-layout-header>

    <q-page-container>
      <transition
        appear
        enter-active-class="animated fadeIn"
        leave-active-class="animated fadeOut"
        duration="500"
      >
        <router-view />
      </transition>
    </q-page-container>

    <q-layout-footer>
      <q-tabs swipeable animated position="top">
        <q-route-tab v-if="!userId" slot="title" icon="home" :to="{name:'home'}" label="Home" />
        <q-route-tab v-if="userId" slot="title" icon="list" :to="{name:'list'}" label="Playlist"/>
        <q-route-tab v-if="userId" slot="title" icon="star" :to="{name:'vote'}" label="Vote"/>
        <q-route-tab v-if="userId" slot="title" icon="search" :to="{name:'search'}" label="Recherche"/>
      </q-tabs>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { QLayoutFooter, openURL, QTabs, QTab, QBtn } from 'quasar'

export default {
  components: { QLayoutFooter, QTabs, QTab, QBtn },
  name: 'MyLayout',
  data () {
    return {
      userId: localStorage.getItem('userId'),
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
