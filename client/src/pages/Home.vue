<template>
  <q-page padding>
    <q-modal v-model="modal" minimized v-if="tempUser">
      <div style="padding: 50px">
        <div class="q-display-1 q-mb-md">Bienvenue !</div>
        <p>Mais es-tu vraiment {{ tempUser.name }} ?</p>
        <q-btn @click="connect" style="margin-right:15px" color="blue" label="Oui !" />
        <q-btn color="red" v-close-overlay label="Heu en fait non..." />
      </div>
  </q-modal>
      <!--<h3 class="text-grey-8">Qui es-tu ?</h3>-->
      <div class="row justify-center">
        <div class="q-pa-sm col col-6" v-for="user in users" :key="user.name">
          <q-card v-ripple class="relative-position">
            <q-card-media overlay-position="top" :height="150">
              <img :src="user.avatar">
            </q-card-media>
            <q-card-title class="relative-position">
              <q-btn class="bg-indigo-8" round size="md" color="primary" style="position: absolute; top: 0px; right: 8px; transform: translateY(-50%);">
                <div @click="identify(user)" class="q-btn-inner row col items-center justify-center">
                <i aria-hidden="true" class="q-icon material-icons">check</i>
                </div>
              </q-btn>
              <div>
                {{ user.name }}
              </div>
            </q-card-title>
          </q-card>
        </div>
      </div>
  </q-page>
</template>

<script>
import Api from '../services/Api'

export default {
  data () {
    return {
      tempUser: undefined,
      modal: false,
      users: [],
      currentUser: localStorage.getItem('userId'),
      currentUserName: localStorage.getItem('userName')
    }
  },
  methods: {
    identify (user) {
      this.tempUser = user
      this.modal = true
    },
    connect () {
      this.currentUser = this.tempUser._id
      this.currentUserName = this.tempUser.name
      localStorage.setItem('userId', this.tempUser._id)
      localStorage.setItem('userName', this.tempUser.name)
      this.modal = false
      location.reload()
    }
  },
  mounted () {
    Api().get('users')
      .then(resp => {
        console.log('user', resp)
        this.users = resp.data.users
      })
  }
}
</script>

<style lang="stylus" scoped>
  .q-layout-page-container .q-layout-page .q-pa-sm .q-card .q-card-media
    height : 25vw

  .q-layout-page-container .q-layout-page .q-pa-sm .q-card .q-card-media img
    object-fit: cover
    height: 100%
</style>
