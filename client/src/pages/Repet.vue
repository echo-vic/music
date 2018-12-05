<template>
  <q-page padding>
    En cours de developpement...<br><br>
    <q-btn icon="add" label="Nouvelle répète" @click="newRepetModal = true"/>
    <br><br>
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
      <q-select v-if="songList.length"
      v-model="songSelect"
      :options="songList"
    />
    <br>
      <q-btn
        color="primary"
        @click="addNewSong()"
        label="Ajouter"
      />
      </div>
    </q-modal>

    <q-list highlight>
      <q-collapsible v-for="repet in repets" :key="repet._id" :label="formatDate(repet.date)">
          <q-item>
            <q-btn icon="add" label="Nouveau titre" @click="displayNewSongModal(repet._id)"/>
          </q-item>
          <q-item v-for="song in repet.songs" :key="song">
            {{getSongName(song)}}
          </q-item>
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
      console.log('sgons', songs)
      let average = parseInt((nbUsers * 5) / 1.1)
      let els = []
      songs.forEach(el => {
        if (!el.vote.find(v => v.value === 0)) {
          let total = 0
          el.vote.forEach(v => {
            total += v.value
          })
          el.total = total
          if (total >= average) {
            els.push(el)
          }
        }
      })
      let songsOrder = orderBy(els, ['total'], ['desc'])
      songsOrder.forEach(el => {
        this.songList.push({
          label: el.track.name,
          value: el._id
        })
      })
    },
    addNewSong () {
      Api().put('new_repet_song/' + this.currentRepeatId, {
        'songId': this.songSelect
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
