<template>
  <v-layout column align-center style="width: 100%">
    <v-alert style="width: 100%" type="success" v-if="files.length === progress && files.length > 0">
      Images uploaded
    </v-alert>

    <v-progress-linear class="mb-3" v-if="files.length > 0 && files.length !== progress" :indeterminate="progress === 0" :value="progress / files.length * 100"></v-progress-linear>

    <v-file-input
      solo-inverted
      chips
      v-model="files"
      style="width: 100%"
      show-size
      multiple
      label="Image upload"
      accept="image/*"
      @change="handleFileSelect"
    ></v-file-input>
  </v-layout>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { auth } from 'firebase/app'
import 'firebase/auth'
import { uploadImage } from '../uploadImage'

@Component
export default class Upload extends Vue {
  private files: File[] = []
  private progress: number = 0

  async handleFileSelect (e: Event) {
    if (this.files === null) return

    if (!auth().currentUser) {
      this.$router.push('/login')
      return
    }

    this.progress = 0

    for (let i = 0; i < this.files.length; i++) {
      uploadImage(this.files[i]).then(() => {
        this.progress++;
      })
    }
  }
}
</script>
