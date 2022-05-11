<template>
  <prime-button id="signinButton" @click="login()">Login mit Google</prime-button>
</template>

<script lang="ts" setup>
/// <reference path="../node_modules/@types/gapi.auth2/index.d.ts" />

import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { getDatabase, ref as firebaseRef, child, set as firebaseSet, get as firebaseGet } from 'firebase/database'
import { useAuth } from '@vueuse/firebase/useAuth'

const { $firebase } = useNuxtApp();
const auth = getAuth();
const { isAuthenticated } = useAuth(auth);

watchEffect(async () => {
  if (isAuthenticated.value) {
    await navigateTo('/map')
  }
})

async function login() {
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

    const credential = GoogleAuthProvider.credential(id_token);
    const { user: firebaseUser } = await signInWithCredential(auth, credential);

    if (!firebaseUser) return

    const db = getDatabase();
  
    const dataRef = child(child(child(firebaseRef(db), 'users'), firebaseUser.uid), 'data');

    firebaseSet(child(dataRef, 'code'), code)

    const mailtoRef = child(dataRef, 'mailTo');
    if (!(await firebaseGet(mailtoRef)).exists()) {
      firebaseSet(mailtoRef, 'anzeigenbussgeldstelle@owi-verkehr.hamburg.de')
    }

    const nameRef = child(dataRef, 'name');
    if (!(await firebaseGet(nameRef)).exists()) {
      firebaseSet(nameRef, firebaseUser.displayName)
    }
  });
}
</script>