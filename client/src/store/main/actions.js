import SongService from './../../services/SongService'
import UserService from './../../services/UserService'
import GroupService from './../../services/GroupService'

export function changeLoadingState ({commit}, state) {
  commit('CHANGE_LOADING_STATE', state)
}

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

/* export async function loadMyGroups ({commit, state}) {
  GroupService.getMyGroups(state.user.id)
    .then(resp => {
      commit('UPDATE_MY_GROUPS', resp.data)
    })
    .catch(error => {
      console.error('error', error)
    })
} */

/* export async function loadMembersGroup ({commit, state}, {groupId}) {
  GroupService.getMembers(groupId)
    .then(resp => {
      commit('UPDATE_MY_GROUP', resp.data)
    })
    .catch(error => {
      console.error('error', error)
    })
} */

export async function loadMyCreatorGroups ({commit, state}) {
  console.log('state.user.id', state.user.id)
  GroupService.getMyCreatorGroups(state.user.id)
    .then(resp => {
      commit('UPDATE_MY_CREATOR_GROUPS', resp.data)
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

export async function connectUser ({commit, dispatch}, {email, password}) {
  commit('CHANGE_LOADING_STATE', true)
  const response = await UserService.logIn(email, password)
  if (response) {
    console.log('connectUSer', response)
    localStorage.setItem('token', response.data.id)
    commit('UPDATE_TOKEN', response.data.id)
    dispatch('getUser', {
      userId: response.data.userId
    })
    // commit('UPDATE_USER', response.data)
    commit('CHANGE_LOADING_STATE', false)
    return response
  } else {
    console.error('error')
  }
}

export async function getUser ({commit, dispatch}, {userId}) {
  UserService.getUser(userId)
    .then(resp => {
      commit('UPDATE_USER', resp.data)
      localStorage.setItem('userId', resp.data.id)
      localStorage.setItem('userEmail', resp.data.email)
      dispatch('loadMyCreatorGroups')
      dispatch('loadMyGroups')
    })
    .catch(error => {
      console.error('error', error)
    })
}

export async function createGroup ({commit, dispatch}, {name, genre, departement, commune, level, creatorId, instrument, username}) {
  commit('CHANGE_LOADING_STATE', true)
  console.log('createGroue action', instrument)
  const response = await GroupService.createGroup(name, genre, departement, commune, level, creatorId, instrument, username)
  if (response) {
    dispatch('loadMyCreatorGroups')
    commit('CHANGE_LOADING_STATE', false)
    return response.data
  } else {
    console.error('error')
  }
}

export async function deleteMyCreatorGroup ({commit, dispatch}, {groupId}) {
  commit('CHANGE_LOADING_STATE', true)
  const response = await GroupService.deleteMyGroup(groupId)
  if (response) {
    dispatch('loadMyCreatorGroups')
    commit('CHANGE_LOADING_STATE', false)
    return response.data
  } else {
    console.error('error')
  }
}
