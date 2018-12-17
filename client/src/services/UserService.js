import Api from './Api.js'

export default {
  getUsers () {
    return Api().get('/users')
  }
}
