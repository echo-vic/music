import SongService from './../../services/SongService'
import UserService from './../../services/UserService'

export async function loadSongs ({commit}, silent) {
  if (!silent) {
    commit('CHANGE_LOADING_STATE', true)
  }
  SongService.getSongs()
    .then(resp => {
      commit('UPDATE_SONG_LIST', resp.data.selection)
      commit('CHANGE_LOADING_STATE', false)
    })
    .catch(error => {
      commit('CHANGE_LOADING_STATE', false)
      console.error('error', error)
    })
}

export async function loadUsers ({commit}) {
  UserService.getUsers()
    .then(resp => {
      commit('UPDATE_USERS', resp.data.users)
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function createUser ({commit, dispatch}, {username, email, password}) {
  commit('CHANGE_LOADING_STATE', true)
  const response = await UserService.createUser(username, email, password)
  if (response) {
    commit('CHANGE_LOADING_STATE', false)
    return response.data
  } else {
    console.error('error')
  }
}
