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
        <v-btn icon @click="() => $router.push('/stats')"><v-icon>mdi-poll-box</v-icon></v-btn>
        <v-btn icon @click="() => $router.push('/settings')"><v-icon>mdi-cog</v-icon></v-btn>
        <v-spacer></v-spacer>
        <v-btn icon @click="logout()"><v-icon>mdi-logout-variant</v-icon></v-btn>
        <v-btn icon @click="dark = !dark"><v-icon>mdi-brightness-6</v-icon></v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <v-main>
      <router-view/>
    </v-main>
    <v-footer app absolute padless>
      <v-col class="text-center" cols="12">
        {{ commitRef }} | {{context}} | {{buildId}} | {{buildDate}}
      </v-col>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import  firebase from 'firebase/app'
import 'firebase/auth'
import { Component, Vue, Watch } from 'vue-property-decorator'

@Component
export default class App extends Vue {
  dark: boolean = true
  commitRef: string = process.env.VUE_APP_COMMIT_REF
  context: string = process.env.VUE_APP_CONTEXT
  buildId: string = process.env.VUE_APP_BUILD_ID
  buildDate: string = process.env.VUE_APP_BUILD_DATE

  @Watch('dark')
  updateTheme() {
    (this as any).$vuetify.theme.dark = this.dark
  }

  logout () {
     firebase.auth().signOut()
  }
}
</script>
