<template>
  <q-page padding class="docs-input row justify-center">
      <div style="width: 500px; max-width: 90vw;">
        <q-input v-model="form.userName" float-label="Pseudo" />
        <q-input v-model="form.email" type="email" float-label="Email" />
        <q-input v-model="form.password" type="password" float-label="Password" />
        <q-input v-model="form.passwordConf" type="password" float-label="Password confirmation" />
        <q-btn @click="create" label="Create" />
      </div>
  </q-page>
</template>

<script>

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
      if (this.form.password === this.form.passwordConf) {
        this.$store.dispatch('main/createUser', {
          username: this.form.userName,
          email: this.form.email,
          password: this.form.password
        })
          .then((resp) => {
            this.$q.dialog({
              title: 'Success',
              message: resp
            })
              .then(() => {
                this.$router.push({
                  name: 'connect'
                })
              })
              .catch((error) => {
                console.log(error)
                // Picked "Cancel" or dismissed
              })
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
      } else {
        alert('error password confirmation')
      }
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
