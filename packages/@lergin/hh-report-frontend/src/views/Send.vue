<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-data-table
          :headers="headers"
          :items="items"
          item-key=".key"
          :sort-desc="true"
          sort-by="date"
          :rows-per-page="10"
        >
          <template slot="item" slot-scope="props">
            <tr>
              <td>
                <v-dialog
                  fullscreen
                  hide-overlay
                  open-on-hover
                >
                  <template v-slot:activator="{ on }"><v-img v-on="on" :src="props.item.thumbnail" contain width="100px"></v-img></template>
                  <v-img :lazy-src="props.item.thumbnail" :src="props.item.url" max-height="100vh"></v-img>
                </v-dialog>
              </td>
              <td>{{ new Date(props.item.date * 1000).toLocaleString("de-DE") }}</td>
              <td>
                <v-edit-dialog
                  :return-value.sync="props.item.plate"
                  lazy
                  @save="() => savePlate(props.item)"
                > {{ props.item.plate }}
                  <v-text-field
                    :disabled="props.item.send"
                    slot="input"
                    v-model="props.item.plate"
                    label="Edit"
                    single-line
                    counter
                  ></v-text-field>
                </v-edit-dialog>
              </td>
              <td>
                <v-edit-dialog
                  lazy
                > {{ props.item.address }}
                  <GmapMap
                    slot="input"
                    :center="{lat: props.item.loc.lat, lng: props.item.loc.lon}"
                    :zoom="15"
                    style="width: 500px; height: 300px"
                    mapTypeId="roadmap"
                    :options="{
                      mapTypeControl: false,
                      streetViewControl: false,
                      zoomControl: false
                    }"
                  >
                    <GmapMarker
                      :position="{lat: props.item.loc.lat, lng: props.item.loc.lon}"
                      @dragend="(({latLng: {lat, lng}}) => {
                        props.item.loc.lon = lng();
                        props.item.loc.lat = lat();
                        saveLoc(props.item);
                      })"
                      :draggable="!props.item.send"
                    />
                  </GmapMap>
                </v-edit-dialog>
              </td>
              <td>
                <v-radio-group v-model="props.item.parking"
                  :disabled="props.item.send"
                  @change="() => saveParking(props.item)"
                >
                  <v-radio
                    label="Parken"
                    :value="true"
                  ></v-radio>
                  <v-radio
                    label="Halten"
                    :value="false"
                  ></v-radio>
                </v-radio-group>
              </td>
              <td>
                <v-combobox
                  :disabled="props.item.send"
                  @change="() => saveWhere(props.item)"
                  v-model="props.item.where"
                  :items="parkingPlaces"
                ></v-combobox>
              </td>
              <td><v-checkbox v-model="props.item.endangering"
                    :disabled="props.item.send"
                  @change="() => saveEndagering(props.item)"
                ></v-checkbox></td>
              <td>
                <v-layout align-center>
                  <v-checkbox  :disabled="props.item.send" v-model="props.item.intend" hide-details class="shrink mr-2" @change="() => saveIntend(props.item)"></v-checkbox>
                  <v-text-field :disabled="!props.item.intend || props.item.send" v-model="props.item.intendReason" label="begründung" @change="() => saveIntend(props.item)"></v-text-field>
                </v-layout>
              </td>
              <td>
                <v-btn icon @click="() => send(props.item)" :disabled="props.item.send">
                <v-icon>send</v-icon>
                </v-btn>
                <v-btn icon @click="() => deleteItem(props.item)">
                <v-icon>delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </template>
        </v-data-table>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { auth, database } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ImageData, ParkingPlaces } from '@lergin/hh-report-common'
import '../vuefire'

type FirebaseImageData = ImageData & {'.key': string}

@Component({
  firebase () {
    const db = database()
    const user = auth().currentUser

    return {
      items: db.ref('users').child(user ? user.uid : 'no-user').child('images')
    }
  }
})
export default class Send extends Vue {
  private headers: {text: string, value?: keyof ImageData, sortable?: boolean, width?: string}[] = [
    { text: 'Bild', sortable: false, width: '150px' },
    { text: 'Datum', value: 'date' },
    { text: 'Kennzeichen', value: 'plate' },
    { text: 'Addresse', value: 'address' },
    { text: 'Parken', value: 'parking' },
    { text: 'Wo', value: 'where' },
    { text: 'Gefährdung', value: 'endangering' },
    { text: 'Vorsatz', value: 'intend' },
    { text: '', sortable: false }
  ]

  private parkingPlaces: ParkingPlaces[] = Object.values(ParkingPlaces)

  private getFirebaseItemRef (item: FirebaseImageData) {
    return this.$firebaseRefs.items.child(item['.key'])
  }

  private setFirebaseItemProp (prop: keyof ImageData, item: FirebaseImageData) {
    this.getFirebaseItemRef(item).child(prop).set(item[prop])
  }

  savePlate (item: FirebaseImageData) {
    this.setFirebaseItemProp('plate', item)
  }

  saveLoc (item: FirebaseImageData) {
    this.setFirebaseItemProp('loc', item)
  }

  saveParking (item: FirebaseImageData) {
    this.setFirebaseItemProp('parking', item)
  }

  saveWhere (item: FirebaseImageData) {
    this.setFirebaseItemProp('where', item)
  }

  saveIntend (item: FirebaseImageData) {
    this.setFirebaseItemProp('intend', item)
    this.setFirebaseItemProp('intendReason', item)
  }

  saveEndagering (item: FirebaseImageData) {
    this.setFirebaseItemProp('endangering', item)
  }

  deleteItem (item: FirebaseImageData) {
    this.getFirebaseItemRef(item).remove()
  }

  send (item: FirebaseImageData) {
    this.getFirebaseItemRef(item).child('send').set(true)
  }
}
</script>
