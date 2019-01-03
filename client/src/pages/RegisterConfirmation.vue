<template>
  <q-page padding>
      <div class="row justify-center">
        <q-jumbotron>
          <div class="q-display-3">Bienvenue !</div>
          <div class="q-subheading">
            Votre adresse email a bien été verifiée
          </div>
          <hr class="q-hr q-my-lg">
          <router-link to="/connect">
            <q-btn color="primary" class="q-py-sm q-px-xl full-width" label="Se connecter" />
          </router-link>
        </q-jumbotron>
      </div>
  </q-page>
</template>

<script>

export default {}
</script>
