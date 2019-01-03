<template>
  <q-layout view="lHh Lpr lFf">
    <q-layout-header reveal>
      <q-toolbar
        color="deep-orange-5"
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
        duration="200"
      >
        <router-view />
      </transition>
    </q-page-container>

    <q-layout-footer>
      <q-tabs inverted color="deep-orange-8" swipeable animated position="top">
        <q-route-tab slot="title" icon="home" :to="{name:'home'}" label="Home" />
        <q-route-tab v-if="userId" slot="title" icon="list" :to="{name:'list'}" label="Résultat"/>
        <q-route-tab v-if="userId" slot="title" icon="how_to_vote" :to="{name:'vote'}" label="Votez">
          <transition
            appear
            enter-active-class="animated fadeIn"
            leave-active-class="animated fadeOut"
            duration="500"
          >
            <q-chip v-if="awaitingVote && awaitingVote.length" square floating color="positive" style="right: 25%; top: 3px">{{ awaitingVote.length }}</q-chip>
          </transition>
        </q-route-tab>
        <q-route-tab v-if="userId" slot="title" icon="search" :to="{name:'search'}" label="Proposez"/>
        <q-route-tab v-if="userId" slot="title" icon="ion-md-calendar" :to="{name:'repet'}" label="Calendrier"/>
      </q-tabs>
    </q-layout-footer>
  </q-layout>
</template>

<script>
import { QLayoutFooter, openURL, QTabs, QTab, QBtn } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { QLayoutFooter, QTabs, QTab, QBtn },
  name: 'MyLayout',
  data () {
    return {
      leftDrawerOpen: this.$q.platform.is.desktop
    }
  },
  computed: {
    ...mapGetters('main', ['awaitingVote']),
    userId () {
      return localStorage.getItem('userId')
    }
  },
  methods: {
    openURL
  }
}
</script>

<style>
</style>
