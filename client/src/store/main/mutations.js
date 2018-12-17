export function CHANGE_LOADING_STATE (state, payload) {
  state.loading = payload
}

export function UPDATE_SONG_LIST (state, payload) {
  state.songsList = payload
}

export function UPDATE_USERS (state, payload) {
  state.users = payload
}
