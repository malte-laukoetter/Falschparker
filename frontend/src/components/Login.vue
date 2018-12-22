<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <div ref="firebaseui-auth-container"></div>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import {storage, auth} from 'firebase'
import * as uuid from 'uuid/v1'
import firebaseui from 'firebaseui'
import 'firebaseui/dist/firebaseui.css'

export default {
  mounted() {
    auth().onAuthStateChanged(user => {
      if (user) {
        this.$router.push("/upload");
      } else {
        const ui = new firebaseui.auth.AuthUI(auth());

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
          tosUrl: () => {console.log('TODO: TOS')},
          // Privacy policy url.
          privacyPolicyUrl: () => {console.log('TODO: PRIVACY')},
          credentialHelper: firebaseui.auth.CredentialHelper.GOOGLE_YOLO
        };

        ui.start(this.$refs["firebaseui-auth-container"], uiConfig);
        // Sign the user in anonymously since accessing Storage requires the user to be authenticated.
        //auth().signInAnonymously();
      }
    });
  }
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
