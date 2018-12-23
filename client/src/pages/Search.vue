<template>
  <q-page padding class="search-page q-pl-md q-pr-md">
    <q-search v-model="search" :debounce="600" placeholder="Recherche par artiste, album, titre..." @input="searchSpotify" />
    <div class="q-mt-md">
      <q-spinner-puff class="spinner" v-if="search.length && loading" color="secondary" :size="50" />
      <q-list v-if="searchResult.length">
        <q-collapsible class="shadow-1" :image="res.album.images[1].url" v-for="res in searchResult" :key="res.id"
        :label="res.name" :sublabel="res.artists[0].name">
          <q-card-actions align="around">
            <q-btn flat icon="fab fa-spotify" @click="launchSpotify(res.uri)" size="md" color="positive"></q-btn>
            <q-btn class="btn-audio btn-audio-play" :id="'btn-audio-play-'+res.id" v-if="res.preview_url" flat color="primary" label="" icon="ion-md-play" size="md" @click="play(res.id)" />
            <q-btn class="btn-audio btn-audio-pause" :id="'btn-audio-pause-'+res.id" v-if="res.preview_url" flat color="primary" label="" icon="ion-md-pause" size="md" @click="pause(res.id)" />
            <q-btn flat color="primary" label="Choisir" icon="ion-md-add-circle" size="md" @click="select(res)" />
            <audio :src="res.preview_url" :id="'audio-' + res.id" type="audio/mpeg"></audio>
          </q-card-actions>
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
    launchSpotify (id) {
      location.href = id
    },
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
          this.$store.dispatch('main/loadSongs', true)
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
