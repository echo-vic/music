<template>
  <q-card>
    <q-card-title>
      {{ groupDetail.name }}
    </q-card-title>
    <q-card-separator />
    <q-card-main>
      {{ groupDetail.genre }}<br>
      Code postal: {{ groupDetail.commune }}
      <hr>
      Membres: <br>
      <ul v-for="member in groupDetail.members" :key="member.id">
        <li>{{ member.username }} | {{member.instrument}}</li>
      </ul>
    </q-card-main>
    <q-card-separator />
      <q-card-actions>
        <q-btn flat @click="deleteGroup(groupDetail.id)">DELETE</q-btn>
        <q-btn flat @click="addMember(groupDetail.id)">ADHERER</q-btn>
      </q-card-actions>
  </q-card>
</template>

<script>
export default {
  name: 'group',
  props: {
    groupDetail: Object
  },
  data () {
    return {
      members: undefined
    }
  },
  methods: {
    addMember (groupId) {
      // GroupService.addMember(groupId, this.user, 'batterie')
    },
    deleteGroup (groupId) {
      this.$store.dispatch('main/deleteMyCreatorGroup', {
        groupId: groupId
      })
    }
  }
}
</script>
