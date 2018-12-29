import Api from './Api.js'

export default {
  getUsers () {
    return Api().get('/users')
  },
  createUser (username, email, password) {
    return Api().post('/users', {
      'username': username,
      'email': email,
      'password': password
    })
  }
}
