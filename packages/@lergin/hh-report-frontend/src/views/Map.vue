<template>
  <l-map ref="map" :max-zoom="17" :min-zoom="2">
    <l-tile-layer v-bind="tileProvider"></l-tile-layer>
    <l-marker v-for="item in items" :key="item['.key']" :lat-lng="[item.loc.lat, item.loc.lon]" :title="item.kfz">
      <l-popup>
        <v-img :src="item.thumbnail" contain width="100px"></v-img>
      </l-popup>
    </l-marker>
  </l-map>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { LMap, LTileLayer, LMarker, LTooltip, LPopup } from 'vue2-leaflet'
import { auth, database } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ImageData, ParkingPlaces } from '@lergin/hh-report-common'
import '../vuefire'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

type FirebaseImageData = ImageData & { '.key': string }

delete (L.Icon.Default.prototype as any)._getIconUrl

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
})

type OpenStreetMapTileProviderKey = 'watercolor' | 'dark' | 'base'

type OpenStreetMapTileProvider = L.TileLayerOptions & {
  url: string
  attribution: string
  ext?: string
}

const openStreetMapTileProvider: {readonly [K in OpenStreetMapTileProviderKey]: OpenStreetMapTileProvider} = {
  watercolor: {
    url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.jpg',
    attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    subdomains: 'abcd',
    ext: 'jpg'
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd'
  },
  base: {
    url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    subdomains: 'abc'
  }
}

@Component({
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup
  },
  firebase () {
    const db = database()
    const user = auth().currentUser

    return {
      items: {
        source: db.ref('users').child(user ? user.uid : 'no-user').child('images'),
        asObject: false,
        readyCallback: (e: firebase.database.DataSnapshot) => {
          const data: {[key: string]: ImageData} = e.val()

          const latLons = Object.values(data).map(({ loc }) => loc ? L.latLng(loc.lat, loc.lon) : undefined)
          const bound = L.latLngBounds(latLons)

          const map: L.Map = ((this as MapView).$refs.map as any).mapObject
          map.fitBounds(bound)
        }
      }
    }
  }
})
export default class MapView extends Vue {
  public items: FirebaseImageData[] = []
  public provider: OpenStreetMapTileProviderKey = 'watercolor'

  get tileProvider (): OpenStreetMapTileProvider {
    return openStreetMapTileProvider[this.provider]
  }
}
</script>
