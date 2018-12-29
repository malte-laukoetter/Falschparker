<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div ref="firebaseui-auth-container"></div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { storage, auth } from 'firebase'
import * as uuid from 'uuid/v1'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

@Component
export default class Login extends Vue {
  mounted () {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push('/upload')
      } else {
        const ui = new firebaseui.auth.AuthUI(auth())

        const uiConfig = {
          signInOptions: [
            {
              provider: auth.GoogleAuthProvider.PROVIDER_ID,
              authMethod: 'https://accounts.google.com',
              clientId: '418563000081-k3sf7bmkvmh22p6cs0gf6oup1n0tjnc4.apps.googleusercontent.com',
              scopes: [
                'profile',
                'https://www.googleapis.com/auth/gmail.send'
              ]
            }
          ],
          // Terms of service url.
          tosUrl: 'https://lergin.de/privacy',
          // Privacy policy url.
          privacyPolicyUrl: 'https://lergin.de/privacy',
          credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
        }

        ui.start(this.$refs['firebaseui-auth-container'] as Element, uiConfig)
      }
    })
  }
}
</script>
