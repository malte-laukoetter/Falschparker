<template>
<div>
  <v-container fluid grid-list-md>
    <v-layout row wrap>
      <v-flex xs12 sm6 md4 lg2>
        <v-card>
          <v-card-title><h4>Mehrfach Angezeigt</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense style="max-height: 408px; overflow: auto;">
            <v-list-item
              @click="() => null"
              v-for="plate in mostReportedPlates"
              :key="plate.plate"
            >
              <v-list-item-content>{{plate.plate}}</v-list-item-content>
              <v-list-item-content class="align-end">{{plate.amount}}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 md4 lg4>
        <v-card>
          <v-card-title><h4>Anzeigen / Monat</h4></v-card-title>
          <v-divider></v-divider>
          <stats-chart-time :chart-data="createChartData(monthlyAmounts)"></stats-chart-time>
        </v-card>
      </v-flex>
  
      <v-flex xs12 sm6 md4 lg6>
        <v-card>
          <v-responsive :aspect-ratio="2/1">
            <v-card-title><h4>Anzeigen / Tag</h4></v-card-title>
            <v-divider></v-divider>
            <stats-chart-time unit="month" :chart-data="createChartData(dailyAmounts)"></stats-chart-time>
          </v-responsive>
        </v-card>
      </v-flex>

      <v-flex xs12 sm6 md4 lg2>
        <v-card>
          <v-card-title><h4>Anzeigen / Wochentag</h4></v-card-title>
          <v-divider></v-divider>
          <v-list dense>
            <v-list-item
              @click="() => null"
              v-for="(amount, weekday) in weekdayAmounts"
              :key="weekday"
            >
              <v-list-item-content>{{weekdays[weekday]}}</v-list-item-content>
              <v-list-item-content class="align-end">{{amount}}</v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-flex>
  

      <v-flex xs12 sm6 md4 lg4>
        <v-card>
          <v-card-title><h4>Anzeigen / Jahr</h4></v-card-title>
          <v-divider></v-divider>
          <stats-chart-time unit="year" :chart-data="createChartData(yearlyAmounts)"></stats-chart-time>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { auth, database } from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import { ImageData } from '../../lib/ImageData'
import { ParkingPlaces } from '../../lib/ParkingPlaces'
import '../vuefire'
import StatsChartTime from '../components/StatsChartMonthly.vue'
import { ChartData } from 'chart.js'
import { DateTime, Info } from 'luxon'

type FirebaseImageData = ImageData & { '.key': string }

@Component({
  components: {
    StatsChartTime
  },
  firebase () {
    const db = database()
    const user = auth().currentUser

    return {
      items: {
        source: db.ref('users').child(user ? user.uid : 'no-user').child('images'),
        asObject: false
      }
    }
  }
})
export default class Statistics extends Vue {
  public items: FirebaseImageData[] = []
  private weekdays: string[] = Info.weekdays("long")
  private datacollection: ChartData  = {
    labels: ['a', 'n'],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [this.getRandomInt(), this.getRandomInt()]
      }
    ]
  }

  getRandomInt () {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }

  get itemsByPlate () {
    return this.items.reduce((prev, curr) => {
      if (!curr.plate) return prev

      if (prev[curr.plate]) {
        prev[curr.plate].push(curr)
      } else {
        prev[curr.plate] = [curr]
      }

      return prev
    }, {} as {[key: string]: FirebaseImageData[]})
  }

  get itemsSortedByDate() {
    return this.items.sort((a, b) => a.date && b.date ? a.date - b.date : 0)
  }


  get yearlyAmounts () {
    return this.itemsSortedByDate.reduce((acc, item) => {
      if(item.date) {
        const date = DateTime.fromSeconds(item.date).set({
          day: 1,
          month: 1
        }).toISODate()
        
        acc.set(date, (acc.get(date) || 0) + 1)
      }

      return acc
    }, new Map<string, number>())
  }

  get monthlyAmounts () {
    return this.itemsSortedByDate.reduce((acc, item) => {
      if(item.date) {
        const date = DateTime.fromSeconds(item.date).set({
          day: 1
        }).toISODate()
        
        acc.set(date, (acc.get(date) || 0) + 1)
      }

      return acc
    }, new Map<string, number>())
  }

  get dailyAmounts () {
    return this.itemsSortedByDate.reduce((acc, item) => {
      if(item.date) {
        const date = DateTime.fromSeconds(item.date).toISODate()
        
        acc.set(date, (acc.get(date) || 0) + 1)
      }

      return acc
    }, new Map<string, number>())
  }

  get weekdayAmounts () {
    return this.items.reduce((acc, item) => {
      if(item.date) {
        acc[DateTime.fromSeconds(item.date).weekday - 1]++
      }
      return acc
    }, [0,0,0,0,0,0,0])
  }

  createChartData(amounts: Map<string, number>): ChartData {
    return {
      datasets: [
        {
          label: 'Anzeigen',
          backgroundColor: '#f87979',
          data: [... amounts.entries()].map(([date, y]) => ({t: date, y}))
        }
      ]
    }
  }

  get plateAmounts () {
    return Object.entries(this.itemsByPlate).map(([plate, values]) => ({ plate, amount: values.length }))
  }

  get mostReportedPlates () {
    return this.plateAmounts.filter(({amount}) => amount > 1).sort((a, b) => b.amount - a.amount)
  }
}
</script>
