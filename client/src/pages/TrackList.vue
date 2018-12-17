<template>
  <q-page padding>
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
    <!-- Morceaux selectionnés -->
    <div class="q-ml-sm q-mr-sm q-pb-md">
      <div class="q-subheading text-weight-bold text-grey-10 text-weight-regular" style="    text-transform: uppercase;">Titres selectionnés</div>
      <div class="q-caption text-grey-10">( > {{ average }} points )</div>
    </div>
    <q-card v-for="s in allVoteOk" :key="s._id" class="q-ml-sm q-mr-sm q-mb-lg">
      <q-card-title class="q-pa-none relative-position">
          <div style="border-bottom: 1px solid #ccc" class="row items-center bg-grey-1">
            <div class="col col-3 col-md-6">
              <img style="max-width: 100%; display: block; border-top-left-radius: 3px" :src="s.track.album.images[0].url" alt="">
            </div>
            <div class="col" style="line-height: 1.2rem">
                <div class="text-grey-9 q-title q-ml-sm">{{ s.track.name }}</div>
                <div class="text-grey-7 q-subheading q-ml-sm q-mt-sm">{{s.track.artists[0].name}}</div>
            </div>
          </div>
          <q-chip floating color="grey-8" style="top: -0em; right: -0em;border-radius: 0; border-top-right-radius: 3px;">{{s.total}} pts</q-chip>
        </q-card-title>
      <q-list>
        <q-item>
          <q-item-main>
            <div class="row row items-center q-ma-xs" v-if="s.vote.length" v-for="vote in s.vote" :key="vote.userId">
              <div class="col text-grey-9">{{ getUserName(vote.userId) }}</div>
              <div class="col col-auto" style="margin: 0 auto"><q-rating slot="subtitle" :value="vote.value" readonly :max="5" /></div>
            </div>
            <div class="text-grey-6 q-caption q-ml-xs q-mt-sm">Proposé le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</div>
          </q-item-main>
        </q-item>
      </q-list>
      <q-card-separator />
      <q-card-actions align="around">
        <q-btn @click="launchSpotify(s.track.uri)" flat icon="fab fa-spotify" size="md" color="positive"></q-btn>
        <q-btn @click="showUpdateModal(s)" flat icon="ion-md-star" size="lg" color="yellow"></q-btn>
      </q-card-actions>
    </q-card>

    <!--<q-list>
      <q-list-header><span class="emoticone" style="font-size: 1.5em; vertical-align:middle">🤘</span> <span style="font-size: 1.2em"> Titres selectionnés ( > {{ average }} points )</span></q-list-header>
      <q-collapsible v-for="s in allVoteOk" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name + ' (' + s.total + ' pts)'">
        <div class="row items-center">
          <div v-if="s.track.preview_url" class="col col-auto" style="margin: 0 auto">
            <audio :id="'audio-'+s._id" :src="s.track.preview_url"></audio>
            <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.track.preview_url, s._id)" push rounded color="primary" size="sm" label="Play" icon="ion-md-play" />
            <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.track.preview_url, s._id)" push rounded color="primary" size="sm" label="Pause" icon="ion-md-pause" />
          </div>
          <div class="col col-auto" style="margin: 0 auto">
            <q-btn @click="launchSpotify(s.track.uri)" push rounded color="tertiary" size="sm" label="Spotify" icon="fab fa-spotify" />
          </div>
          <div class="col col-auto" style="margin: 0 auto">
            <q-btn push @click="showUpdateModal(s)" rounded color="secondary" size="sm" label="Vote" icon="ion-md-redo" />
          </div>
          <div class="col col-auto" style="margin: 0 auto">
            <small>Album: <span>{{ s.track.album.name }}</span></small><br>
            <small>Ajouté le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</small><br>
            <q-rating slot="subtitle" :value="getAverage(s.vote)" readonly :max="5" />
            <br><br>
          </div>
        </div>

        <div class="row" v-if="s.vote.length">
          <div class="col q-pa-sm" v-for="vote in s.vote" :key="vote.userId">
          <div>{{ getUserName(vote.userId) }}</div>
            <q-rating slot="subtitle" :value="vote.value" readonly :max="5" />
          </div>
        </div>
      </q-collapsible>
    </q-list>-->

    <!-- Morceaux refusés -->
    <q-list highlight style="margin-top: 40px">
      <q-list-header><span class="emoticone" style="font-size: 1.5em; vertical-align:middle">👎</span>
      <span style="font-size: 1.2em"> Titres refusés</span></q-list-header>
      <q-collapsible v-for="s in allVoteKo" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name">
        <div class="row items-center">
          <div v-if="s.track.preview_url" class="col col-auto" style="margin: 0 auto">
            <audio :id="'audio-'+s._id" :src="s.track.preview_url"></audio>
            <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.track.preview_url, s._id)" push rounded color="primary" size="sm" label="Play" icon="ion-md-play" />
            <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.track.preview_url, s._id)" push rounded color="primary" size="sm" label="Pause" icon="ion-md-pause" />
          </div>
          <div class="col col-auto">
            <q-btn push @click="showUpdateModal(s)" rounded color="secondary" size="sm" label="Vote" icon="ion-md-redo" />
          </div>
          <div class="col col-auto" style="margin: 0 auto">
            <small>Album: <span>{{ s.track.album.name }}</span></small><br>
            <small>Ajouté le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</small><br>
            <q-rating slot="subtitle" :value="getAverage(s.vote)" readonly :max="5" />
            <br><br>
          </div>
        </div>

        <div class="row" v-if="s.vote.length">
          <div class="col q-pa-sm" v-for="vote in s.vote" :key="vote.userId">
          <div>{{ getUserName(vote.userId) }}</div>
            <q-rating slot="subtitle" :value="vote.value" readonly :max="5" />
          </div>
        </div>
      </q-collapsible>
    </q-list>

    <!-- Morceaux refusés direct -->
    <q-list highlight style="margin-top: 40px">
      <q-list-header><span class="emoticone" style="font-size: 1.5em; vertical-align:middle">🖕</span>
      <span style="font-size: 1.2em"> Titres refusés direct !</span></q-list-header>
      <q-collapsible v-for="s in vetoVote" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name">
        <div class="row items-center">
          <div v-if="s.track.preview_url" class="col col-auto" style="margin: 0 auto">
            <audio :id="'audio-'+s._id" :src="s.track.preview_url"></audio>
            <q-btn class="play" :id="'play-'+s._id" @click="playMusic(s.track.preview_url, s._id)" push rounded color="primary" label="Play" icon="ion-md-play" />
            <q-btn class="pause hide" :id="'pause-'+s._id" @click="pauseMusic(s.track.preview_url, s._id)" push rounded color="primary" label="Pause" icon="ion-md-pause" />
            <br><br>
          </div>
          <div class="col col-auto" style="margin: 0 auto">
            <small>Album: <span>{{ s.track.album.name }}</span></small><br>
            <small>Ajouté le {{ formatDate(s.creationDate) }} par {{ getUserName(s.userId) }}</small><br>
            <q-rating slot="subtitle" :value="getAverage(s.vote)" readonly :max="5" />
            <br><br>
          </div>
        </div>

        <div class="row" v-if="s.vote.length">
          <div class="col q-pa-sm" v-for="vote in s.vote" :key="vote.userId">
          <div>{{ getUserName(vote.userId) }}</div>
            <q-rating slot="subtitle" :value="vote.value" readonly :max="5" />
          </div>
        </div>
      </q-collapsible>
    </q-list>
  </q-page>
</template>

<script>

import Api from '../services/Api'
import { mapState, mapGetters } from 'vuex'
import moment from 'moment'
import orderBy from 'lodash/orderBy'

export default {
  name: 'playlist',
  data () {
    return {
      ratingModel: undefined,
      updateOpened: false,
      trackSelected: undefined,
      selections: [],
      rating: {
        muse: 1
      }
    }
  },
  computed: {
    ...mapState('main', ['songsList', 'users']),
    ...mapGetters('main', ['average', 'vetoVote', 'awaitingVote']),
    allVote () {
      if (this.songsList && this.users) {
        return this.songsList.filter(el => {
          let len = el.vote.length
          return len === this.users.length
        })
      }
    },
    allVoteOk () {
      if (this.allVote) {
        let els = []
        this.allVote.forEach(el => {
          if (!el.vote.find(v => v.value === 0)) {
            let total = 0
            el.vote.forEach(v => {
              total += v.value
            })
            el.total = total
            if (total >= this.average) {
              els.push(el)
            }
          }
        })
        return orderBy(els, ['total'], ['desc'])
        // return els
      }
    },
    allVoteKo () {
      if (this.allVote) {
        let els = []
        this.allVote.forEach(el => {
          let total = 0
          el.vote.forEach(v => {
            total += v.value
          })
          if (total < this.average) {
            els.push(el)
          }
        })
        return els
      }
    }
  },
  methods: {
    launchSpotify (id) {
      location.href = id
    },
    showUpdateModal (track) {
      this.updateOpened = true
      this.ratingModel = undefined
      this.trackSelected = track
    },
    updateVote () {
      let userId = localStorage.getItem('userId')
      let selection = this.songsList.find(sel => sel._id === this.trackSelected._id)
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
            // this.getSelections()
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
    getAverage (votes) {
      let total = 0
      votes.forEach(v => {
        total += v.value
      })
      return total / votes.length
    },
    formatDate (date) {
      return moment(date).lang('fr').format('L')
    },
    getUserName (userId) {
      if (this.users) {
        let userName = this.users.find(user => user._id === userId)
        if (userName) {
          return userName.name
        }
      }
    }
  },
  mounted () {
    this.checkIfUserIsLogged()
    let silentLoading
    if (this.songsList && this.songsList.length) {
      silentLoading = true
    } else {
      silentLoading = false
    }
    this.$store.dispatch('main/loadSongs', silentLoading)
    this.$store.dispatch('main/loadUsers')
  }
}
</script>

<style scoped>
  .hide {
    display: none;
  }
  .show {
    display: block;
  }
  .modal .modal-rate {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px;
  }
</style>
