<template>
  <q-page padding>
      <!--<h3 class="text-grey-8">Qui es-tu ?</h3>-->
      <div class="row justify-center">
        <div v-if="user">Bienvenue {{user.username}}</div>
      </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('main', ['user'])
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
