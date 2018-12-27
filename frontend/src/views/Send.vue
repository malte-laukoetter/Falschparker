<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <v-data-table
          :headers="headers"
          :items="items"
          :pagination.sync="pagination"
          item-key=".key"
        >
          <template slot="items" slot-scope="props">
            <td>
              <v-dialog
                v-model="props.item.imageDialog"
                fullscreen
                lazy
              >
                <v-img slot="activator" :src="props.item.thumbnail" contain width="100px"></v-img>
                <v-img @click="props.item.imageDialog = false" :lazy-src="props.item.thumbnail" :src="props.item.url" max-heigth="100vh"></v-img>
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
                :return-value.sync="props.location"
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
                :items="['Geh-/Radweg', 'Schutzstreifen', 'Kreuzung', 'Feuerwehrzufahrt']"
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
          </template>
        </v-data-table>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { database } from 'firebase'
// import '../vuefire.d.ts'

@Component({
  firebase () {
    const db = database()
    return {
    // simple syntax, bind as an array by default
      items: db.ref('images')
    }
  }
} as any)
export default class Send extends Vue {
  private dialog = {}
  private pagination = {
    descending: true,
    sortBy: 'date',
    rowsPerPage: 10
  }
  private location = {}
  private headers = [
    {
      text: 'Bild',
      value: 'img',
      sortable: false,
      width: '150px'
    },
    {
      text: 'Datum',
      value: 'date'
    },
    { text: 'Kennzeichen', value: 'plate' },
    { text: 'Addresse', value: 'address' },
    { text: 'Parken', value: 'parking' },
    { text: 'Wo', value: 'where' },
    { text: 'Gefährdung', value: 'endangering' },
    { text: 'Vorsatz', value: 'intend' },
    { text: '', value: '', sortable: false }
  ]

  savePlate (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('plate').set(item.plate)
  }

  saveLoc (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('loc').set(item.loc)
  }

  saveParking (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('parking').set(item.parking)
  }

  saveWhere (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('where').set(item.where)
  }

  saveIntend (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('intend').set(item.intend)
    ;(this as any).$firebaseRefs.items.child(item['.key']).child('intendReason').set(item.intendReason)
  }

  saveEndagering (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('endangering').set(item.endangering)
  }

  deleteItem (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).remove()
  }

  send (item: any) {
    (this as any).$firebaseRefs.items.child(item['.key']).child('send').set(true)
  }
}
</script>
