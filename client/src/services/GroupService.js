import Api from './Api.js'

export default {
  getGenre () {
    return Api().get('/genres')
  },
  /* getMembers (groupId) {
    return Api().get('/members?filter{"where":{"groupId":' + groupId + '}}')
  },
  addMember (groupId, user, instrument) {
    return Api().post('/members', {
      'groupId': groupId,
      'user': user,
      'instrument': instrument
    })
  }, */
  getMyCreatorGroups (creatorId) {
    return Api().get('/groups?filter{"where":{"creatorId":' + creatorId + '}}')
  },
  /* getMyGroups (userId) {
    return Api().get('/members?filter{"where":{"user.id":' + userId + '}}')
  }, */
  deleteMyGroup (groupId) {
    return Api().delete('/groups/' + groupId)
  },
  createGroup (name, genre, departement, commune, level, creatorId, instrument, username) {
    console.log('isntrument service', instrument)
    return Api().post('/groups', {
      'name': name,
      'genre': genre,
      'creation_date': new Date(),
      'country': 'fr',
      'departement': departement,
      'commune': commune,
      'level': level,
      'creatorId': creatorId,
      'members': [
        {
          userId: creatorId,
          username: username,
          instrument: instrument
        }
      ]
    })
  }
}
