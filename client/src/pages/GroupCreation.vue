<template>
  <q-page padding class="docs-input row justify-center">
      <div style="width: 500px; max-width: 90vw;">
        <p>Nouveau groupe :</p>
        <q-input v-model="form.name" float-label="Nom" />
        <q-select
          float-label="Genre"
          v-model="form.genre"
          :options="genres"
        />
        <q-select
          float-label="Niveau"
          v-model="form.level"
          :options="levels"
        />
        <q-select @input="searchRegions"
          float-label="Departement"
          filter
          v-model="form.departement"
          :options="departements"
        />
        <q-select
          v-if="form.departement"
          float-label="Communes"
          filter
          v-model="form.commune"
          :options="communes"
      />
      <q-select
          float-label="Instrument"
          v-model="form.instrument"
          :options="intrument"
      />

      <q-btn class="q-mt-xl" @click="createGroup" label="Create" />
      </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
import GroupService from '../services/GroupService.js'
import axios from 'axios'

export default {
  name: 'groupCreation',
  data () {
    return {
      intrument: [
        {
          label: 'batterie',
          value: 'batterie'
        },
        {
          label: 'guitare',
          value: 'guitare'
        },
        {
          label: 'chant',
          value: 'chant'
        }
      ],
      departements: [],
      communes: [],
      searchCityResult: [],
      genres: [],
      levels: [
        {
          label: 'débutant',
          value: 'beginner'
        },
        {
          label: 'pro',
          value: 'pro'
        }
      ],
      form: {
        name: '',
        genre: '',
        level: '',
        departement: '',
        commune: '',
        instrument: ''
      }
    }
  },
  computed: mapState('main', ['user']),
  methods: {
    getDepartements () {
      axios.get('https://geo.api.gouv.fr/departements')
        .then(resp => {
          resp.data.forEach(el => {
            this.departements.push({
              label: el.nom,
              value: el.code
            })
          })
        })
    },
    searchRegions () {
      this.communes = []
      axios.get('https://geo.api.gouv.fr/departements/' + this.form.departement + '/communes')
        .then(resp => {
          resp.data.forEach(el => {
            this.communes.push({
              label: el.nom,
              value: el.code
            })
          })
        })
    },
    searchCity (name) {
      axios.get('https://geo.api.gouv.fr/communes?nom=' + name)
        .then(resp => {
          this.searchCityResult = resp.data
        })
    },
    createGroup () {
      this.$store.dispatch('main/createGroup', {
        name: this.form.name,
        genre: this.form.genre,
        departement: this.form.departement,
        commune: this.form.commune,
        level: this.form.level,
        creatorId: this.user.id,
        instrument: this.form.instrument,
        username: this.user.username
      })
        .then(resp => {
          this.$router.push({
            name: 'home'
          })
        })
    }
  },
  created () {
    this.getDepartements()
    GroupService.getGenre()
      .then(resp => {
        this.genres = resp.data
      })
  }
}
</script>

<style lang="stylus" scoped>
  .q-layout-page-container .q-layout-page .q-pa-sm .q-card .q-card-media
    height : 25vw

  .q-layout-page-container .q-layout-page .q-pa-sm .q-card .q-card-media img
    object-fit: cover
    height: 100%
</style>
