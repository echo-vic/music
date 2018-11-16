<template>
  <q-page padding class="docs-input row justify-center">
      <div style="width: 500px; max-width: 90vw;">
        <q-input v-model="form.userName" float-label="Nom" />
        <q-input v-model="form.email" type="email" float-label="Email" />
        <q-input v-model="form.password" type="password" float-label="Password" />
        <q-input v-model="form.passwordConf" type="password" float-label="Password confirmation" />
        <q-btn @click="create" label="Create" />
      </div>
  </q-page>
</template>

<script>
import Api from '../services/Api'

export default {
  data () {
    return {
      form: {
        userName: '',
        email: '',
        password: '',
        passwordConf: ''
      },
      tempUser: undefined,
      modal: false,
      users: [],
      currentUser: localStorage.getItem('userId'),
      currentUserName: localStorage.getItem('userName')
    }
  },
  methods: {
    create () {
      Api().post('/user', {
        'username': this.form.userName,
        'email': this.form.email,
        'password': this.form.password,
        'passwordConf': this.form.passwordConf
      })
        .then(resp => {
          console.log('resp', resp)
        })
    },
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
