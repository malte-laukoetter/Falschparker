<template>
  <v-app
    :dark="dark"
  >
    <v-app-bar
      app
      :color="`primary ${dark ? `darken-1` : 'lighten-2'}`"
    >
      <v-toolbar-title @click="() => $router.push('/')">Falschparker</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn text @click="() => $router.push('/')"><v-icon>mdi-notebook-multiple</v-icon></v-btn>
        <v-btn icon @click="() => $router.push('/map')"><v-icon>mdi-map</v-icon></v-btn>
        <v-btn icon @click="() => $router.push('/stats')"><v-icon>mdi-chart-box-outline</v-icon></v-btn>
        <v-btn icon @click="() => $router.push('/settings')"><v-icon>mdi-gear</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="logout()"><v-icon>mdi-logout-variant</v-icon></v-btn>
        <v-btn icon @click="dark = !dark"><v-icon>mdi-brightness-6</v-icon></v-btn>
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
