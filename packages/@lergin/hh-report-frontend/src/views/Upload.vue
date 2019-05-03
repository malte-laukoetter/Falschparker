<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <input type="file" multiple accept="image/*" @change="handleFileSelect"/>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { auth } from 'firebase/app'
import 'firebase/auth'
import { uploadImage } from '../uploadImage'

@Component
export default class Upload extends Vue {
  async handleFileSelect (e: Event) {
    e.stopPropagation()
    e.preventDefault()

    if (!(e.target instanceof HTMLInputElement)) return

    const files = e.target.files

    if (files === null) return

    if (!auth().currentUser) {
      this.$router.push('/login')
      return
    }

    for (let i = 0; i < files.length; i++) {
      uploadImage(files[i])
    }
  }
}
</script>
