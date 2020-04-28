<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <report-card-grid
          expandable
          :items="convertItems(items)"
          @change:license-plate="(e) => setFirebaseItemProp('plate', e.item, e.newValue)"
          @change:date="(e) => setFirebaseItemProp('date', e.item, e.newValue)"
          @change:parking="(e) => setFirebaseItemProp('parking', e.item, e.newValue)"
          @change:offence="(e) => setFirebaseItemProp('where', e.item, e.newValue)"
          @change:with-intend="(e) => setFirebaseItemProp('intend', e.item, e.newValue)"
          @change:intend-reason="(e) => setFirebaseItemProp('intendReason', e.item, e.newValue)"
          @change:endangering="(e) => setFirebaseItemProp('endangering', e.item, e.newValue)"
          @change:obstruction="(e) => setFirebaseItemProp('obstruction', e.item, e.newValue)"
          @change:location="(e) => setFirebaseItemProp('loc', e.item, e.newValue)"
          @delete="(e) => deleteItem(e.item)"
          @send="(e) => send(e.item)"
        ></report-card-grid>
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
import ReportCardGrid from '@/components/ReportCardGrid.vue'

type FirebaseImageData = ImageData & {'.key': string}

@Component({
  firebase () {
    const db = database()
    const user = auth().currentUser

    return {
      items: db.ref('users').child(user ? user.uid : 'no-user').child('images')
    }
  },
  components: {
    ReportCardGrid
  }
})
export default class Send extends Vue {
  private parkingPlaces: ParkingPlaces[] = Object.values(ParkingPlaces)

  private getFirebaseItemRef (item: FirebaseImageData) {
    return this.$firebaseRefs.items.child(item['.key'])
  }

  private setFirebaseItemProp (prop: keyof ImageData, item: FirebaseImageData, newValue: unknown) {
    this.getFirebaseItemRef(item).child(prop).set(newValue)
  }

  deleteItem (item: FirebaseImageData) {
    this.getFirebaseItemRef(item).remove()
  }

  send (item: FirebaseImageData) {
    this.getFirebaseItemRef(item).child('send').set(true)
  }
  
  convertItems(items: FirebaseImageData[]) {
    console.log(items.map(item => item.loc))
    return items.map(item => ({
      ... item,
      images: [{
        src: item.url,
        thumbnail: item.thumbnail
      }]
    }))
  }  
}
</script>
