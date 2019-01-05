<template>
  <q-page padding>
      <!--<h3 class="text-grey-8">Qui es-tu ?</h3>-->
      <div class="row justify-center">
        <div v-if="user">Bienvenue {{user.username}}</div>
      </div>
      <div class="row justify-center q-mt-md">
        <q-btn label="créer groupe" :to="{name:'groupCreation'}" />
      </div>
      <div class="row justify-center q-mt-md">
        <div v-for="group in myCreatorGroups" :key="group.id" style="width: 100%">
          <group :groupDetail="group"/>
        </div>
        <!--<q-card style="width: 100%" inline class="q-ma-sm" v-for="group in myCreatorGroups" :key="group.id">
          <q-card-title>
            {{ group.name }}
          </q-card-title>
          <q-card-separator />
          <q-card-main>
            {{ group.genre }}
            {{ group.commune }}
          </q-card-main>
          <q-card-separator />
            <q-card-actions>
              <q-btn flat @click="deleteGroup(group.id)">DELETE</q-btn>
              <q-btn flat @click="addMember(group.id)">ADHERER</q-btn>
            </q-card-actions>
        </q-card>-->

      </div>
  </q-page>
</template>

<script>
import { mapState } from 'vuex'
// import GroupService from '../services/GroupService'
import Group from '../components/Group'

export default {
  name: 'home',
  components: { Group },
  computed: {
    ...mapState('main', ['user', 'myCreatorGroups'])
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
