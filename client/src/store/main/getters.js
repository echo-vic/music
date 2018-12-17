export function average (state) {
  if (state.users) {
    return parseInt((state.users.length * 5) / 1.2)
  }
}

export function vetoVote (state) {
  if (state.songsList) {
    let result = []
    state.songsList.forEach(song => {
      if (song.vote.find(vote => vote.value === 0)) {
        result.push(song)
      }
    })
    return result
  }
}

export function awaitingVote (state) {
  if (state.songsList && state.users) {
    return state.songsList.filter(el => {
      return el.vote.length < state.users.length
    })
  }
}
