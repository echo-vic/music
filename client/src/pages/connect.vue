<template>
  <q-page padding class="docs-input row justify-center">
      <div style="width: 500px; max-width: 90vw;">
        <q-input v-model="form.logemail" type="email" float-label="Email" />
        <q-input v-model="form.logpassword" type="password" float-label="Password" />
        <q-btn @click="connect" label="Connect" />
      </div>
  </q-page>
</template>

<script>
import Api from '../services/Api'

export default {
  data () {
    return {
      form: {
        logemail: '',
        logpassword: ''
      },
      tempUser: undefined,
      modal: false,
      users: [],
      currentUser: localStorage.getItem('userId'),
      currentUserName: localStorage.getItem('userName')
    }
  },
  methods: {
    connect () {
      console.log('CONNECT !')
      /* Api().post('/user', {
        'logemail': this.form.logemail,
        'logpassword': this.form.logpassword
      })
        .then(resp => {
          console.log('resp', resp)
        }) */
      /* Api().get('/profile')
        .then(resp => {
          console.log('get profile', resp)
        }) */
      Api().post('/login', {
        'username': this.form.logemail,
        'password': this.form.logpassword
      })
        .then(resp => {
          console.log('resp', resp)
        })
    },
    identify (user) {
      this.tempUser = user
      this.modal = true
    }
  },
  mounted () {
    /* Api().get('users')
      .then(resp => {
        this.users = resp.data.users
      }) */
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
