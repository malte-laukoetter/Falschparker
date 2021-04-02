<template>
  <v-col class="text-center text--secondary font-weight-light text-overline" cols="12">
    {{ commitRef }} | {{context}} | {{buildId}} | {{buildDate}}
  </v-col>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component
export default class Footer extends Vue {
  commitRef: string = process.env.VUE_APP_COMMIT_REF.substring(0,6)
  context: string = process.env.VUE_APP_CONTEXT
  buildId: string = process.env.VUE_APP_BUILD_ID.substring(0,6)
  buildDate: string = process.env.VUE_APP_BUILD_DATE
}
</script>