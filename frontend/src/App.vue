<template>
  <v-app>
    <v-toolbar
      app
    >
       <v-toolbar-title>Title</v-toolbar-title>
      <v-spacer></v-spacer>
       <v-toolbar-items>
        <v-btn flat @click="() => $router.push('/send')">Send</v-btn>
        <v-btn flat @click="() => $router.push('/upload')">Upload</v-btn>

      </v-toolbar-items>
    </v-toolbar>
    <v-content>
      <router-view/>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data () {
    return {}
  },
  name: 'App'
}
</script>
