<template>
  <q-page padding>
    <!-- Morceaux selectionnés -->
    <q-list highlight>
      <q-list-header><span class="emoticone" style="font-size: 1.5em; vertical-align:middle">🤘</span> <span style="font-size: 1.2em"> Titres selectionnés ( > {{ average }} points )</span></q-list-header>
      <q-collapsible v-for="s in allVoteOk" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name + ' (' + s.total + ' pts)'">
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

    <!-- Morceaux refusés -->
    <q-list highlight style="margin-top: 40px">
      <q-list-header><span class="emoticone" style="font-size: 1.5em; vertical-align:middle">👎</span>
      <span style="font-size: 1.2em"> Titres refusés</span></q-list-header>
      <q-collapsible v-for="s in allVoteKo" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name">
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
import { Loading } from 'quasar'
import moment from 'moment'
import orderBy from 'lodash/orderBy'

export default {
  name: 'playlist',
  data () {
    return {
      selections: [],
      users: [],
      rating: {
        muse: 1
      }
    }
  },
  computed: {
    average () {
      return parseInt((this.users.length * 5) / 1.2)
    },
    vetoVote () {
      let result = []
      this.selections.forEach(selection => {
        if (selection.vote.find(vote => vote.value === 0)) {
          result.push(selection)
        }
      })
      return result
    },
    awaitingVote () {
      if (this.selections) {
        return this.selections.filter(el => {
          return el.vote.lenght !== this.users.length
        })
      }
    },
    allVote () {
      if (this.selections) {
        return this.selections.filter(el => {
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
      console.log('')
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
      let userName = this.users.find(user => user._id === userId)
      if (userName) {
        return userName.name
      }
    },
    getUsers () {
      Api().get('users')
        .then(resp => {
          this.users = resp.data.users
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
    this.checkIfUserIsLogged()
    this.getUsers()
    this.getSelections()
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
</style>
