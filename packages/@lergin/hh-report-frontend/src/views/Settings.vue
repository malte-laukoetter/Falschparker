<template>
  <v-container  grid-list-md >
    <v-layout row wrap align-center>
      <v-flex xs12>
        <v-text-field
          slot="input"
          v-model="name['.value']"
          @change="() => saveName()"
          hint="Vor- und Nachname"
          persistent-hint
          single-line
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-text-field
          slot="input"
          v-model="address['.value']"
          @change="() => saveAddress()"
          hint="Anschrift"
          persistent-hint
          single-line
        ></v-text-field>
      </v-flex>
      <v-flex xs12>
        <v-combobox
          slot="input"
          v-model="mailTo['.value']"
          @change="() => saveMailTo()"
          label="Mail Addresse der Bußgeldstelle"
          single-line
          :items="['anzeigenbussgeldstelle@eza.hamburg.de', 'anzeigenbussgeldstelle@owi-verkehr.hamburg.de', 'test@lergin.de']"
        ></v-combobox>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { auth, database } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import '../vuefire'

@Component({
  firebase () {
    const db = database()
    const user = auth().currentUser

    return {
      name: {
        source: db.ref('users').child(user ? user.uid : 'no-user').child('data').child('name'),
        asObject: true
      },
      address: {
        source: db.ref('users').child(user ? user.uid : 'no-user').child('data').child('address'),
        asObject: true
      },
      mailTo: {
        source: db.ref('users').child(user ? user.uid : 'no-user').child('data').child('mailTo'),
        asObject: true
      }
    }
  }
})
export default class Settings extends Vue {
  private name: { '.value': string, '.key': string } = { '.value': '', '.key': '' }
  private address: { '.value': string, '.key': string } = { '.value': '', '.key': '' }
  private mailTo: { '.value': string, '.key': string } = { '.value': '', '.key': '' }

  saveName () {
    return this.$firebaseRefs.name.set(this.name['.value'])
  }

  saveAddress () {
    return this.$firebaseRefs.address.set(this.address['.value'])
  }

  saveMailTo () {
    return this.$firebaseRefs.mailTo.set(this.mailTo['.value'])
  }
}
</script>
