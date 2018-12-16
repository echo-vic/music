<template>
  <q-page v-if="selections.length" padding>
    <q-pull-to-refresh :handler="refresh">
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

    <!-- update vote -->
    <q-modal class="modal" minimized v-model="updateOpened">
      <p class="text-center" style="margin-top: 20px">Modifier le vote</p>
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
        @click="updateVote"
        label="Vote"
      />
      </div>
    </q-modal>
    <!--<q-list v-if="!noSelection.length">
      <h3 style="text-align: center">Pas de vote en cours</h3>
    </q-list>
    -->

    <!--//////////// -->
    <!-- awaitingVote -->
    <!--//////////// -->
    <div v-if="awaitingVote && awaitingVote.length">
    <div class="q-ml-sm q-mr-sm q-mb-lg">
      <div class="q-subheading text-grey-10 text-weight-regular">Titres en attente de ton vote :</div>
      <hr>
    </div>
    <q-card v-if="s.vote.length < users.length" v-for="s in awaitingVote" :key="s._id" class="q-ml-sm q-mr-sm q-mb-lg">
      <q-card-title class="q-pa-none">
          <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-1">
            <div class="col col-3 col-md-6">
              <img style="max-width: 100%; display: block" :src="s.track.album.images[0].url" alt="">
            </div>
            <div class="col" style="line-height: 1.2rem">
                <div class="text-grey-9 q-title q-ml-sm">{{ s.track.name }}</div>
                <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{s.track.artists[0].name}}</div>
            </div>
          </div>
        </q-card-title>
      <q-list class="q-pt-none">
        <q-item>
          <q-item-main>
            <div class="row row items-center q-ma-xs" v-for="user in users" :key="user._id">
              <div class="col text-grey-9">{{ user.name }}</div>
              <div class="col col-auto" style="margin: 0 auto"><q-rating slot="subtitle" :value="getVote(s._id, user._id)" readonly :max="5" /></div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-sm">Proposé le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</div>
          </q-item-main>
        </q-item>
      </q-list>
      <q-card-separator />
      <q-card-actions align="around">
        <div v-if="s.track.preview_url">
          <audio :id="'audio-'+s._id" :src="s.track.preview_url"></audio>
          <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.track.preview_url, s._id)" flat color="primary" size="md" icon="ion-md-play" />
          <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.track.preview_url, s._id)" color="primary" flat size="md" icon="ion-md-pause" />
        </div>
        <div>
          <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        </div>
        <div>
          <q-btn v-if="showVoteBtn(s)" @click="showModal(s)" flat color="yellow" size="md" icon="ion-md-star" />
        </div>
        <div>
          <q-btn v-if="showVoteBtn(s)" @click="showVetoModal(s)" flat color="red" size="md" icon="ion-md-thumbs-down" />
        </div>
        <div>
          <q-btn @click="remove(s)" flat color="negative" size="md" icon="ion-md-trash" />
        </div>
      </q-card-actions>
    </q-card>
    </div>
    <!--<q-list class="round-borders shadow-5" v-if="awaitingVote && awaitingVote.length" striped sparse separator multiline>
      <q-list-header><span class="list-header">Titres en attente de ton vote :</span></q-list-header>
      <q-item v-if="s.vote.length < users.length" v-for="s in awaitingVote" :key="s._id">
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
    </q-list>-->

    <!--//////////// -->
    <!-- alreadyVote -->
    <!--/////////////-->
    <q-list class="round-borders shadow-5" v-if="alreadyVote.length" striped sparse separator multiline style="margin-top: 30px">
      <q-list-header><span class="list-header">Tu as déjà voté pour les titres suivants :</span></q-list-header>
      <q-item v-if="s.vote.length < users.length" v-for="s in alreadyVote" :key="s._id">
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
              <q-btn push @click="showUpdateModal(s)" rounded color="secondary" size="sm" label="Vote" icon="ion-md-redo" />
            </div>
            <!--<div>
              <q-btn push @click="showUpdateVetoModal(s)" rounded color="negative" size="sm" label="Veto" icon="ion-md-sad" />
            </div>-->
          </q-item-tile>
        </q-item-side>
      </q-item>
    </q-list>
    </q-pull-to-refresh>
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
      updateOpened: false,
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
      let userId = localStorage.getItem('userId')
      this.selectionWithoutVeto.forEach(selection => {
        if (selection.vote.find(vote => vote.userId === userId)) {
          result.push(selection)
        }
      })
      return result
    },
    awaitingVote () {
      let result = []
      let userId = localStorage.getItem('userId')
      this.selectionWithoutVeto.forEach(selection => {
        if (!selection.vote.find(vote => vote.userId === userId)) {
          result.push(selection)
        }
      })
      return result
    }
  },
  methods: {
    remove (track) {
      this.$q.dialog({
        title: 'Confirm',
        message: 'Voulez vous supprimer ce titre ?',
        ok: 'Oui',
        cancel: 'Non'
      }).then(() => {
        Api().delete('track/' + track._id)
          .then(resp => {
            this.getSelections()
            // this.$q.notify('Le titre a été supprimé')
          })
      }).catch(() => {
        // this.$q.notify('Opération annulé')
      })
    },
    refresh (done) {
      Api().get('selection')
        .then(resp => {
          this.selections = resp.data.selection
          done()
        })
    },
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
      if (userId) {
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
      } else {
        this.$q.notify({
          type: 'negative',
          message: `Vous n'êtes pas connecté. Veuillez relancer l'application`,
          position: 'top'
        })
      }
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
    showUpdateModal (track) {
      this.updateOpened = true
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
      if (userId) {
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
      } else {
        this.$q.notify({
          type: 'negative',
          message: `Vous n'êtes pas connecté. Veuillez relancer l'application`,
          position: 'top'
        })
      }
    },
    updateVote () {
      let userId = localStorage.getItem('userId')
      let selection = this.selections.find(sel => sel._id === this.trackSelected._id)
      let vote = selection.vote.find(v => v.userId === userId)
      vote.value = this.ratingModel
      if (userId) {
        Api().put('vote/' + this.trackSelected._id + '/update', selection.vote)
          .then(resp => {
            this.updateOpened = false
            this.$q.notify({
              type: 'positive',
              message: 'Le vote a bien été mise à jour',
              position: 'top'
            })
            this.getSelections()
          })
      } else {
        this.$q.notify({
          type: 'negative',
          message: `Vous n'êtes pas connecté. Veuillez relancer l'application`,
          position: 'top'
        })
      }
    },
    checkIfUserIsLogged () {
      if (!localStorage.getItem('userId')) {
        this.$router.push({
          name: 'home'
        })
      }
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
    this.checkIfUserIsLogged()
    this.getSelections()
  }
}
</script>

<style lang="stylus" scoped>
@import '~variables'

.list-header {
  color: $primary;
}
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
