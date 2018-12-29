/**
 * Augment the typings of Vue.js
 */

import Vue from 'vue'
import { database } from 'firebase'

declare module 'vue/types/vue' {
  interface Vue {
    $firebaseRefs: Readonly<
      Record<
        string,
        database.Reference
      >
    >;
  }
}

type VueFirebaseObject = Record<string, database.Reference>

type FirebaseOption<V> = VueFirebaseObject | ((this: V) => VueFirebaseObject)

declare module 'vue/types/options' {
  interface ComponentOptions<V extends Vue> {
    firebase?: FirebaseOption<V>;
  }
}
