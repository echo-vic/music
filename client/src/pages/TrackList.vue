<template>
  <q-page padding>
    <q-list highlight>
    <q-list-header>Playlist</q-list-header>
    <q-collapsible v-for="s in allVoteOk" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name">
      <div class="row items-center">
        <div class="col col-auto" style="margin: 0 auto">
          <q-btn push rounded color="primary" label="Play" icon="ion-md-play" />
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

export default {
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
    awaitingVote () {
      if (this.selections) {
        return this.selections.filter(el => {
          return el.vote.lenght !== 4
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
      let average = (this.users.length * 5) / 2
      if (this.allVote) {
        let els = []
        this.allVote.forEach(el => {
          let total = 0
          el.vote.forEach(v => {
            total += v.value
          })
          if (total >= average) {
            els.push(el)
          }
        })
        return els
      }
    }
  },
  methods: {
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
    this.getUsers()
    this.getSelections()
  }
}
</script>
