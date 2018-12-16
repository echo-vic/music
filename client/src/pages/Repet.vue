<template>
  <q-page padding>
    <div class="row justify-center">
    <q-btn icon="add" color="primary"  outline class="q-mb-md" label="Nouvelle répète" @click="newRepetModal = true"/>
    </div>
    <q-modal v-model="newRepetModal" minimized>
      <div style="padding: 20px 30px">
        <h4 style="margin: 0">Nouvelle Répète</h4>
      <q-datetime v-model="nextRepetDate" type="datetime" float-label="Date de la prochaine répète"/>
      <br>
      <q-btn
        color="primary"
        @click="create"
        label="Create"
      />
      </div>
    </q-modal>

    <q-modal v-model="newSongModal" minimized>
      <div style="padding: 20px 30px">
        <h4 style="margin: 0">Nouveau titre</h4>
      <br>
      <q-btn-dropdown label="Ajouter" color="primary">
        <!-- dropdown content -->
        <q-list link>
          <q-item v-for="s in songList" :key="s._id">
            <q-item-side :avatar="s.track.album.images[2].url" />
            <q-item-main>
              <q-item-tile label>{{s.track.artists[0].name + ' - ' + s.track.name}}</q-item-tile>
            </q-item-main>
            <q-item-side right>
              <q-btn push rounded color="primary" label="" icon="ion-md-add" size="sm" @click="addNewSong(s)" />
            </q-item-side>
          </q-item>
        </q-list>
      </q-btn-dropdown>
      </div>
    </q-modal>

      <q-card v-for="repet in repets" :key="repet._id" inline class="q-ma-sm">
      <q-card-media>
        <img :src="repet.songs[0].track.album.images[0].url">
        <q-card-title slot="overlay">
          {{formatDate(repet.date)}}
          <span slot="subtitle">Segré</span>
        </q-card-title>
      </q-card-media>
      <q-list>
        <q-item v-for="s in repet.songs" :key="s._id">
          <q-item-side>
            <img :src="s.track.album.images[2].url">
          </q-item-side>
          <q-item-main>
            <q-item-tile label>{{s.track.name}}</q-item-tile>
            <q-item-tile sublabel>{{s.track.artists[0].name}}</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-btn @click="launchSpotify(s.track.uri)" push rounded color="tertiary" size="sm" label="Spotify" icon="fab fa-spotify" />
          </q-item-side>
        </q-item>
      </q-list>
      <q-card-separator />
      <q-card-actions>
        <q-btn @click="displayNewSongModal(repet._id)" flat>Ajouter un titre</q-btn>
      </q-card-actions>
    </q-card>
  </q-page>
</template>

<script>

import Api from '../services/Api'
import { Loading } from 'quasar'
import moment from 'moment'
// import orderBy from 'lodash/orderBy'

export default {
  name: 'repet',
  data () {
    return {
      currentRepeatId: undefined,
      songList: [],
      songSelect: undefined,
      selections: [],
      users: [],
      newSongModal: false,
      newRepetModal: false,
      nextRepetDate: undefined,
      repets: undefined
    }
  },
  computed: {
    allVote () {
      if (this.selections) {
        return this.selections.filter(el => {
          let len = el.vote.length
          return len === this.users.length
        })
      }
    }
  },
  methods: {
    launchSpotify (id) {
      location.href = id
    },
    getSongName (songId) {
      if (this.selections) {
        let song = this.selections.find(el => el._id === songId)
        if (song) {
          return song.track.name
        }
      }
    },
    getAllVoteOk (songs, nbUsers) {
      this.songList = []
      let average = parseInt((nbUsers * 5) / 1.2)
      // let els = []
      songs.forEach(el => {
        let total = el.vote.reduce(function (acc, vote) {
          return acc + vote.value
        }, 0)
        if (total >= average) {
          this.songList.push(el)
        }
        /* if (!el.vote.find(v => v.value === 0)) {
          let total = 0
          el.vote.forEach(v => {
            total += v.value
          })
          el.total = total
          if (total >= average) {
            els.push(el)
          }
        } */
      })
      /* let songsOrder = orderBy(els, ['total'], ['desc'])
      songsOrder.forEach(el => {
        this.songList.push({
          label: el.track.name,
          value: el._id
        })
      }) */
    },
    addNewSong (song) {
      console.log('new song', song)
      Api().put('new_repet_song/' + this.currentRepeatId, {
        'songId': song
      })
        .then(resp => {
          this.getRepets()
          this.newSongModal = false
        })
    },
    displayNewSongModal (repetId) {
      this.currentRepeatId = repetId
      let nbUsers
      Api().get('users')
        .then(resp => {
          nbUsers = resp.data.users.length
          Api().get('selection')
            .then(resp => {
              console.log('get selection', resp)
              this.getAllVoteOk(resp.data.selection, nbUsers)
            })
        })
      this.newSongModal = true
    },
    formatDate (date) {
      return moment(date).lang('fr').format('LLL')
    },
    getRepets () {
      Loading.show()
      Api().get('repet')
        .then(resp => {
          this.repets = resp.data.repet
          Loading.hide()
        })
    },
    getUsers () {
      Api().get('users')
        .then(resp => {
          this.users = resp.data.users
          console.log('user', this.users)
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
    },
    create () {
      Api().post('/add_repet', {
        'date': this.nextRepetDate
      })
        .then(resp => {
          this.$q.notify({
            type: 'positive',
            message: 'Répète créée',
            position: 'top'
          })
          this.newRepetModal = false
        })
    }
  },
  mounted () {
    this.getRepets()
    this.getSelections()
  }
}
</script>

<style scoped>
</style>
