import Api from './Api.js'

export default {
  getUsers () {
    return Api().get('/users')
  },
  getUser (userId) {
    return Api().get('/users/' + userId)
  },
  createUser (username, email, password) {
    return Api().post('/users', {
      'username': username,
      'email': email,
      'password': password
    })
  },
  logIn (email, password) {
    return Api().post('/users/login', {
      'email': email,
      'password': password
    })
  }
}
