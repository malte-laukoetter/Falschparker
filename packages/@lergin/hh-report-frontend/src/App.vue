<template>
  <v-app>
    <v-toolbar
      app
    >
       <v-toolbar-title>Falschparker</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn flat @click="() => $router.push('/send')">Send</v-btn>
        <v-btn flat @click="() => $router.push('/upload')">Upload</v-btn>
        <v-btn flat @click="logout()">Logout</v-btn>
      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
import { auth } from 'firebase'
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  logout () {
    auth().signOut()
  }
}
</script>
