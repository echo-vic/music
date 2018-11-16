<template>
  <q-page padding>
    <q-list highlight>
    <q-list-header>Playlist</q-list-header>
    <q-collapsible v-for="s in selections" :key="s._id" :avatar="s.track.album.images[2].url" :label="s.track.artists[0].name + ' - ' + s.track.name">
      <div class="row items-center">
        <div class="col col-auto" style="margin: 0 auto">
          <q-btn push rounded color="primary" label="Play" icon="ion-md-play" />
          <br><br>
        </div>
        <div class="col col-auto" style="margin: 0 auto">
          <small>Album: <span>{{ s.track.album.name }}</span></small><br>
          <small>Ajouté le 04/09/2018 par Julien</small><br>
          <q-rating slot="subtitle" v-model="rating.muse" readonly :max="5" />
          <br><br>
        </div>
      </div>

      <div class="row">
        <div class="col q-pa-sm">
        <div>Victor</div>
          <q-rating slot="subtitle" v-model="rating.muse" readonly :max="5" />
        </div>
        <div class="col q-pa-sm">
        <div>Victor</div>
          <q-rating slot="subtitle" v-model="rating.muse" readonly :max="5" />
        </div>
        <div class="col q-pa-sm">
        <div>Victor</div>
          <q-rating slot="subtitle" v-model="rating.muse" readonly :max="5" />
        </div>
        <div class="col q-pa-sm">
        <div>Victor</div>
          <q-rating slot="subtitle" v-model="rating.muse" readonly :max="5" />
        </div>
      </div>
    </q-collapsible>
</q-list>
  </q-page>
</template>

<script>

import Api from '../services/Api'
import { Loading } from 'quasar'

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
          return len === 4
        })
      }
    },
    allVoteOk () {
      if (this.allVote) {
        let els = []
        this.allVote.forEach(el => {
          console.log(el)
          let total = 0
          el.vote.forEach(v => {
            total += v.vote
          })
          if (total >= 10) {
            els.push(el)
          }
        })
        return els
      }
    }
  },
  methods: {
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
