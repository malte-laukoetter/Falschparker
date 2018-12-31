import Vue from 'vue'
import './plugins/vuetify'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VueFire from 'vuefire'
import * as VueGoogleMaps from 'vue2-google-maps'
import { initializeApp, auth } from 'firebase'

const firebaseApp = initializeApp({
  apiKey: 'AIzaSyDmV-0vZTZ8Jo6hcjE8-tqm5g3JxDO6Qm4',
  authDomain: 'hh-anzeigen-bussgeldstelle.firebaseapp.com',
  databaseURL: 'https://hh-anzeigen-bussgeldstelle.firebaseio.com',
  projectId: 'hh-anzeigen-bussgeldstelle',
  storageBucket: 'hh-anzeigen-bussgeldstelle.appspot.com',
  messagingSenderId: '418563000081'
})

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDmCabMyWQoBlfdN99Sik4CgS7WMqHEk0A'
  }
})

auth().onAuthStateChanged(user => {
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')

  if (user) {
    console.log('User signed-in.', user)
  } else {
    router.push('/login')
  }
})
