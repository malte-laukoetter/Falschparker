import { initializeApp, FirebaseApp } from "firebase/app"

export default defineNuxtPlugin(() => {
  const firebaseApp = initializeApp({
    apiKey: 'AIzaSyDmV-0vZTZ8Jo6hcjE8-tqm5g3JxDO6Qm4',
    authDomain: 'hh-anzeigen-bussgeldstelle.firebaseapp.com',
    databaseURL: 'https://hh-anzeigen-bussgeldstelle.firebaseio.com',
    projectId: 'hh-anzeigen-bussgeldstelle',
    storageBucket: 'falschparker',
    messagingSenderId: '418563000081'
  })

  console.log("Init fb app", firebaseApp)

  return {
    provide: {
      firebase: firebaseApp
    }
  }
})

declare module '#app' {
  interface NuxtApp {
    $firebase: FirebaseApp
  }
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $hello: FirebaseApp
  }
}
