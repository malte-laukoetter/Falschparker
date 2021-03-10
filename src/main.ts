import Vue from 'vue'
import './plugins/vuetify'
import vuetify from './plugins/vuetify'
import firebase from "firebase/app"
import 'firebase/auth'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VueFire from 'vuefire'
import * as VueGoogleMaps from 'vue2-google-maps'
import { uploadImage } from './uploadImage';

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyDmV-0vZTZ8Jo6hcjE8-tqm5g3JxDO6Qm4',
  authDomain: 'hh-anzeigen-bussgeldstelle.firebaseapp.com',
  databaseURL: 'https://hh-anzeigen-bussgeldstelle.firebaseio.com',
  projectId: 'hh-anzeigen-bussgeldstelle',
  storageBucket: 'falschparker',
  messagingSenderId: '418563000081'
})

Vue.config.productionTip = false

Vue.use(VueFire)
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyDmV-0vZTZ8Jo6hcjE8-tqm5g3JxDO6Qm4'
  }
})

firebase.auth().onAuthStateChanged(user => {
  new Vue({
    vuetify,
    router,
    store,
    render: (h: any) => h(App)
  } as any).$mount('#app')

  if (user) {
    console.log('User signed-in.', user)
  } else {
    router.push('/login')
  }
})

navigator.serviceWorker.addEventListener("message", async event => {
  console.log(event)
  const imageBlob = event.data.file as File

  console.log(imageBlob)
  if (firebase.auth().currentUser) {
    await uploadImage(imageBlob);
    alert(`Uploaded image: ${imageBlob.name}`);
  } else {
    const unsubscribe = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        uploadImage(imageBlob);
        unsubscribe();
      }
    });
  }
})
