<template>
  <v-app
    :dark="dark"
  >
    <v-app-bar
      app
      :color="`primary ${dark ? `darken-1` : 'lighten-2'}`"
    >
       <v-toolbar-title>Falschparker</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn text @click="() => $router.push('/send')">Senden</v-btn>
        <v-btn text @click="() => $router.push('/upload')">Hochladen</v-btn>
        <v-btn text @click="() => $router.push('/map')">Karte</v-btn>
        <v-btn text @click="() => $router.push('/stats')">Statistiken</v-btn>
        <v-btn text @click="() => $router.push('/settings')">Einstellungen</v-btn>
        <v-btn text @click="logout()">Logout</v-btn>
        <v-btn text @click="dark = !dark">{{dark ? 'Day' : 'Night'}}</v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script lang="ts">
import { auth } from 'firebase/app'
import 'firebase/auth'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  dark: boolean = true

  @Watch('dark')
  updateTheme() {
    (this as any).$vuetify.theme.dark = this.dark
  }

  logout () {
    auth().signOut()
  }
}
</script>
