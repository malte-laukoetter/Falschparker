<template>
  <v-app
    :dark="dark"
  >
    <v-toolbar
      app
      color="primary"
    >
       <v-toolbar-title>Falschparker</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn flat @click="() => $router.push('/send')">Send</v-btn>
        <v-btn flat @click="() => $router.push('/upload')">Upload</v-btn>
        <v-btn flat @click="() => $router.push('/settings')">Einstellungen</v-btn>
        <v-btn flat @click="logout()">Logout</v-btn>
        <v-btn flat @click="dark = !dark">{{dark ? 'Day' : 'Night'}}</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { auth } from 'firebase/app'
import 'firebase/auth'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  dark: boolean = true

  logout () {
    auth().signOut()
  }
}
</script>
