// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import VueFire from 'vuefire'
import {initializeApp, auth} from 'firebase'
import Vuetify from 'vuetify'
import * as VueGoogleMaps from "vue2-google-maps";
import 'vuetify/dist/vuetify.min.css'
import './registerServiceWorker'
import App from "./App";
import router from "./router";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDmV-0vZTZ8Jo6hcjE8-tqm5g3JxDO6Qm4",
  authDomain: "hh-anzeigen-bussgeldstelle.firebaseapp.com",
  databaseURL: "https://hh-anzeigen-bussgeldstelle.firebaseio.com",
  projectId: "hh-anzeigen-bussgeldstelle",
  storageBucket: "hh-anzeigen-bussgeldstelle.appspot.com",
  messagingSenderId: "418563000081"
});

Vue.use(Vuetify);
Vue.use(VueFire);

Vue.use(VueGoogleMaps, {
  load: {
    key: "AIzaSyDmCabMyWQoBlfdN99Sik4CgS7WMqHEk0A"
  }
});

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

auth().onAuthStateChanged(user => {
  if (user) {
    console.log("User signed-in.", user);
  } else {
    router.push('/login')
  }
});