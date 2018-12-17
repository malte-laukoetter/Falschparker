<template>
  <v-container fluid>
    <v-slide-y-transition mode="out-in">
      <v-layout column align-center>
        <input type="file" multiple name="demo-file" accept="image/*" @change="handleFileSelect"/>
      </v-layout>
    </v-slide-y-transition>
  </v-container>
</template>

<script>
import {storage} from 'firebase'
import * as uuid from 'uuid/v1'


export default {
  methods: {
    async upload (file) {
      const metadata = {
        contentType: file.type
      };

      // Save the image on Cloud Storage.
      const filePath = file.name;

      try {
        const snapshot = await storage().ref('images').child(filePath).put(file, metadata);
        console.log('Uploaded', snapshot.totalBytes, 'bytes.');
      } catch (error) {
        console.error('Upload failed:', error);
      }
    },
    async handleFileSelect(e) {
      e.stopPropagation();
      e.preventDefault();

      for(const file of e.target.files) {
        this.upload(file);
      }
    }
  } 
}
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
