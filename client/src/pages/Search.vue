<template>
  <q-page padding>
    <q-search v-model="search" :debounce="600" placeholder="Recherche par artiste, album, titre..." @input="searchSpotify" />
    <div class="q-mt-md">
      <q-spinner-puff class="spinner" v-if="search.length && loading" color="secondary" :size="50" />
      <q-list separator v-if="searchResult.length">
        <q-collapsible :avatar="res.album.images[2].url" v-for="res in searchResult" :key="res.id"
        :label="res.name" :sublabel="res.artists[0].name">
          <q-btn class="btn-audio btn-audio-play" :id="'btn-audio-play-'+res.id" v-if="res.preview_url" push rounded color="primary" label="play" icon="ion-md-play" size="sm" @click="play(res.id)" />
          <q-btn class="btn-audio btn-audio-pause" :id="'btn-audio-pause-'+res.id" v-if="res.preview_url" push rounded color="primary" label="pause" icon="ion-md-pause" size="sm" @click="pause(res.id)" />
          <q-btn push rounded color="primary" label="Choisir" icon="ion-md-add" size="sm" @click="select(res)" />
          <audio :src="res.preview_url" :id="'audio-' + res.id" type="audio/mpeg"></audio>
        </q-collapsible>
      </q-list>
    </div>
  </q-page>
</template>

<script>

import Api from '../services/Api'

export default {
  name: 'search',
  data () {
    return {
      search: '',
      searchResult: [],
      token: '',
      loading: false
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
    allPause () {
      document.querySelectorAll('audio').forEach(el => {
        el.pause()
      })
      document.querySelectorAll('.btn-audio.btn-audio-pause').forEach(el => {
        el.style.display = 'none'
      })
      document.querySelectorAll('.btn-audio.btn-audio-play').forEach(el => {
        el.style.display = 'inline-block'
      })
    },
    play (id) {
      this.allPause()
      let audioToPlay = document.querySelector('#audio-' + id)
      let btnActionPlay = document.querySelector('#btn-audio-play-' + id)
      let btnActionPause = document.querySelector('#btn-audio-pause-' + id)
      btnActionPlay.style.display = 'none'
      btnActionPause.style.display = 'inline-block'
      audioToPlay.play()
    },
    pause (id) {
      let audioToPlay = document.querySelector('#audio-' + id)
      let btnActionPlay = document.querySelector('#btn-audio-play-' + id)
      let btnActionPause = document.querySelector('#btn-audio-pause-' + id)
      btnActionPause.style.display = 'none'
      btnActionPlay.style.display = 'inline-block'
      audioToPlay.pause()
    },
    select (t) {
      let userId = localStorage.getItem('userId')
      Api().post('/add_track', {
        'track': t,
        'userId': userId
      })
        .then(resp => {
          this.$q.notify({
            type: 'positive',
            message: 'Morceau séléctioné !',
            position: 'top'
          })
        })
    },
    searchSpotify () {
      this.searchResult = []
      this.loading = true
      if (this.search.length) {
        this.spotify.searchTracks(this.search)
          .then(data => {
            this.loading = false
            this.searchResult = data.body.tracks.items
          })
      }
    }
  },
  mounted () {
    this.checkIfUserIsLogged()
    Api().get('/spotify-secret')
      .then(resp => {
        this.token = resp.data.secret
        this.spotify.setAccessToken(this.token)
      })
  }
}
</script>

<style scoped>
  .btn-audio {
    margin-right: 15px;
  }
  .btn-audio.btn-audio-pause {
    display: none;
  }
  .spinner {
    left: 0;
    right: 0;
    margin-top: 20px;
    position: absolute;
    margin-left: auto;
    margin-right: auto;
  }
</style>
