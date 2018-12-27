<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <input type="file" multiple name="demo-file" accept="image/*" @change="handleFileSelect"/>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { storage, auth } from 'firebase'
import * as uuid from 'uuid/v1'

@Component
export default class Upload extends Vue {
  async upload (file: File) {
    if (!auth().currentUser) {
      this.$router.push('/login')
    }

    const metadata = {
      contentType: file.type
    }

    // Save the image on Cloud Storage.
    const filePath = file.name

    try {
      const user = auth().currentUser

      if (!user) return

      const snapshot = await storage().ref('images').child(user.uid).child(filePath).put(file, metadata)
      console.log('Uploaded', snapshot.totalBytes, 'bytes.')
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  async handleFileSelect (e: Event) {
    e.stopPropagation()
    e.preventDefault()

    if (!(e.target instanceof HTMLInputElement)) return

    const files = e.target.files

    if (files === null) return

    for (let i = 0; i < files.length; i++) {
      this.upload(files[i])
    }
  }
}
</script>
