<template>
  <q-page padding>
    <q-modal class="modal" minimized v-model="opened">
    <div class="modal-rate">
      <q-rating
        v-model="ratingModel"
        size="30px"
        :max="5"
      />
    </div>
    <div class="modal-rate">
      <q-btn
        :disable='!ratingModel'
        color="primary"
        @click="vote"
        label="Vote"
      />
      </div>
    </q-modal>

    <q-modal class="modal" minimized v-model="openedVeto">
    <div class="modal-rate">
      Tu n'aimes pas, mais pas du tout ce titre ?<br>
      C'est ton droit !<br>
      Si tu cliques sur le bouton, il sera retirer de suite de la liste !
    </div>
    <div class="modal-rate">
      <q-btn
        color="primary"
        @click="veto"
        label="Retire moi ce titre"
      />
      </div>
    </q-modal>
    <!--<q-list v-if="!noSelection.length">
      <h3 style="text-align: center">Pas de vote en cours</h3>
    </q-list>
    -->
    <q-list striped sparse separator multiline>
      <q-item v-if="s.vote.length < users.length" v-for="s in selectionWithoutVeto" :key="s._id">
        <q-item-side :avatar="s.track.album.images[2].url" />
        <q-item-main>
          <q-item-tile label>{{ s.track.name }} <span>{{ s.track.artists[0].name }}</span></q-item-tile>
            <q-item-tile sublabel lines="4">
              <table>
                <tr v-for="user in users" :key="user._id">
                  <td class="table-user">{{ user.name }}</td>
                  <td><q-rating size="18px" :value="getVote(s._id, user._id)" readonly :max="5" /></td>
                </tr>
              </table>
            </q-item-tile>
            <q-item-tile sublabel>
              <small>Proposé par {{ getUserName(s.userId) }} le {{ formatDate(s.creationDate) }}</small>
            </q-item-tile>
        </q-item-main>
        <q-item-side right>
          <q-item-tile sublabel lines="2">
            <div v-if="s.track.preview_url" style="margin-bottom: 17px">
              <audio :id="'audio-'+s._id" :src="s.track.preview_url"></audio>
              <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.track.preview_url, s._id)" push rounded color="primary" size="sm" label="Play" icon="ion-md-play" />
              <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.track.preview_url, s._id)" push rounded color="primary" size="sm" label="Pause" icon="ion-md-pause" />
            </div>
            <div style="margin-bottom: 17px">
              <q-btn @click="launchSpotify(s.track.uri)" push rounded color="tertiary" size="sm" label="Spotify" icon="fab fa-spotify" />
            </div>
            <div style="margin-bottom: 17px">
              <q-btn v-if="showVoteBtn(s)" push @click="showModal(s)" rounded color="secondary" size="sm" label="Vote" icon="ion-md-happy" />
            </div>
            <div>
              <q-btn v-if="showVoteBtn(s)" push @click="showVetoModal(s)" rounded color="negative" size="sm" label="Veto" icon="ion-md-sad" />
            </div>
          </q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import Api from '../services/Api'
import { Loading } from 'quasar'
import moment from 'moment'
import orderBy from 'lodash/orderBy'

export default {
  name: 'vote',
  data () {
    return {
      ratingModel: undefined,
      trackSelected: undefined,
      opened: false,
      openedVeto: false,
      selections: [],
      users: [],
      rating: {}
    }
  },
  computed: {
    noSelection () {
      let result = []
      this.selectionWithoutVeto.forEach(selection => {
        if (selection.vote.length < this.users.length) {
          result.push(selection)
        }
      })
      return result
    },
    selectionWithoutVeto () {
      // let scenesOrder = orderBy(resp.body.scenes, ['createdAt'], ['asc'])
      let result = []
      this.selections.forEach(selection => {
        if (!selection.vote.find(vote => vote.value === 0)) {
          result.push(selection)
        }
      })
      return orderBy(result, ['creationDate'], ['desc'])
    },
    alreadyVote () {
      let result = []
      // let userId = localStorage.getItem('userId')
      this.selectionWithoutVeto.forEach(selection => {
        console.log('selection', selection)
      })
      return result
    }
  },
  methods: {
    launchSpotify (id) {
      location.href = id
    },
    playMusic (track, id) {
      document.querySelectorAll('audio').forEach(el => {
        el.pause()
      })
      document.querySelectorAll('.pause').forEach(el => {
        el.classList.add('hide')
      })
      document.querySelectorAll('.play').forEach(el => {
        el.classList.remove('hide')
      })
      document.querySelector('#audio-' + id).play()
      document.querySelector('#play-' + id).classList.add('hide')
      document.querySelector('#pause-' + id).classList.remove('hide')
    },
    pauseMusic (track, id) {
      document.querySelectorAll('audio').forEach(el => {
        el.pause()
      })
      document.querySelector('#audio-' + id).pause()
      document.querySelector('#play-' + id).classList.remove('hide')
      document.querySelector('#pause-' + id).classList.add('hide')
    },
    formatDate (date) {
      return moment(date).lang('fr').format('L')
    },
    veto () {
      let userId = localStorage.getItem('userId')
      Api().put('vote/' + this.trackSelected._id, {
        'value': 0,
        'userId': userId
      })
        .then(resp => {
          this.openedVeto = false
          this.$q.notify({
            type: 'positive',
            message: 'Le titre a été retiré',
            position: 'top'
          })
          this.getSelections()
        })
    },
    showVetoModal (track) {
      this.openedVeto = true
      this.ratingModel = undefined
      this.trackSelected = track
    },
    showModal (track) {
      this.opened = true
      this.ratingModel = undefined
      this.trackSelected = track
    },
    showVoteBtn (track) {
      if (track && track.vote) {
        let userId = localStorage.getItem('userId')
        let findVote = track.vote.find(el => {
          return el.userId === userId
        })
        if (findVote) {
          return false
        } else {
          return true
        }
      }
    },
    getUserName (userId) {
      let userName = this.users.find(user => user._id === userId)
      if (userName) {
        return userName.name
      }
    },
    getVote (trackId, userId) {
      let track = this.selections.find(el => el._id === trackId)
      let vote = track.vote.find(el => el.userId === userId)
      if (vote) { return vote.value }
    },
    vote () {
      let userId = localStorage.getItem('userId')
      Api().put('vote/' + this.trackSelected._id, {
        'value': this.ratingModel,
        'userId': userId
      })
        .then(resp => {
          this.opened = false
          this.$q.notify({
            type: 'positive',
            message: 'Le vote a bien été pris en compte',
            position: 'top'
          })
          this.getSelections()
        })
    },
    getSelections () {
      Loading.show()
      Api().get('selection')
        .then(resp => {
          this.selections = resp.data.selection
          Api().get('users')
            .then(resp => {
              this.users = resp.data.users
              Loading.hide()
            })
        })
    }
  },
  mounted () {
    this.getSelections()
  }
}
</script>

<style lang="stylus" scoped>
.q-list-striped > .q-item:nth-child(even) {
  background-color: rgba(189,189,189,0.2);
}
  table,thead,tbody,tfoot,tr,th,td {
    width: auto;
    height: auto;
    margin: 0;
    padding: 3px 0px;
    border: none;
    border-collapse: inherit;
    border-spacing: 0;
    border-color: inherit;
    vertical-align: inherit;
    text-align: left;
    font-weight: inherit;
    -webkit-border-horizontal-spacing: 0;
    -webkit-border-vertical-spacing: 0;
}
.modal h4 {
  text-align : center
  margin: 10px;
}
.modal .modal-rate {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 20px;
}
.hide {
    display: none;
  }
  .show {
    display: block;
  }
</style>
