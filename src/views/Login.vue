<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <button id="signinButton" @click="login()">Login mit Google</button>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
/// <reference path="../../node_modules/@types/gapi.auth2/index.d.ts" />

import { Component, Vue } from 'vue-property-decorator'
import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebaseui/dist/firebaseui.css'

@Component
export default class Login extends Vue {
  mounted () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push('/upload')
      }
    })
  }

  async login () {

    const SCOPE = 'profile https://www.googleapis.com/auth/gmail.send'

    gapi.load('auth2', async function () {
      const googleAuth: gapi.auth2.GoogleAuth = await gapi.auth2.init({
        client_id: '418563000081-k3sf7bmkvmh22p6cs0gf6oup1n0tjnc4.apps.googleusercontent.com',
        scope: SCOPE,
        ux_mode: 'popup'
      }).then(a => a);

      const googleUser = await googleAuth.signIn({
        prompt: 'select_account',
        scope: SCOPE,
        ux_mode: 'popup'
      })

      const { code } = await googleUser.grantOfflineAccess({
         scope: SCOPE,
         prompt: 'consent'
      });
      const { id_token } = googleUser.getAuthResponse();

      const credential = firebase.auth.GoogleAuthProvider.credential(id_token);
      const { user: firebaseUser } = await  firebase.auth().signInWithCredential(credential);

      if (!firebaseUser) return

      const dataRef =  firebase.database().ref('users').child(firebaseUser.uid).child('data')

      dataRef.child('code').set(code)
      if (!(await dataRef.child('mailTo').get()).exists()) {
        dataRef.child('mailTo').set('anzeigenbussgeldstelle@owi-verkehr.hamburg.de')
      }
      if (!(await dataRef.child('name').get()).exists()) {
        dataRef.child('name').set(firebaseUser.displayName)
      }
    })
  }
}
</script>
