<template>
  <q-page padding class="docs-input row justify-center">
      <div style="width: 500px; max-width: 90vw;">
        <q-input v-model="form.email" type="email" float-label="Email" />
        <q-input v-model="form.password" type="password" float-label="Password" />
        <q-btn @click="connect" label="Connect" />
      </div>
  </q-page>
</template>

<script>
// import UserService from '../services/UserService'
export default {
  name: 'connect',
  data () {
    return {
      form: {
        email: '',
        password: ''
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
      /* UserService.logIn(this.form.email, this.form.password)
        .then(resp => {
          console.log('resp, resp')
        })
        .catch(error => {
          let er = JSON.stringify(error)
          let er2 = JSON.parse(er)
          console.log(error['message'], er2.response.data.error.message)
        }) */
      this.$store.dispatch('main/connectUser', {
        'email': this.form.email,
        'password': this.form.password
      })
        .then(resp => {
          setTimeout(() => {
            this.$router.push({
              name: 'home'
            })
          }, 500)
        })
        .catch(error => {
          this.$store.dispatch('main/changeLoadingState', false)
          let er = JSON.stringify(error)
          let er2 = JSON.parse(er)
          let messageError = er2.response.data.error.message
          console.log(error['message'], er2.response.data.error.message)
          this.$q.dialog({
            title: 'Error',
            message: messageError
          })
        })
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
