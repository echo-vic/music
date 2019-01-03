import axios from 'axios'

export default() => {
  console.log('token', localStorage.token)
  return axios.create({
    baseURL: `http://localhost:3000/api`,
    // baseURL: `https://boiling-refuge-28644.herokuapp.com`
    params: {
      'access_token': localStorage.token
    }
  })
}
