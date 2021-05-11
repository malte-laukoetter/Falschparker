<template>
  <v-carousel
    :height="null"
    :hide-delimiters="images.length < 2"
    :show-arrows="images.length > 1"
    show-arrows-on-hover
  >
    <v-carousel-item v-for="image in images" :key="image.src">
      <v-img
        :lazy-src="`https://storage.googleapis.com/falschparker-thumbnails/${image}`"
        :src="`https://storage.googleapis.com/falschparker/${image}`"
        :aspect-ratio="16 / 9"
        @click.stop="() => $emit('click-image')"
      ></v-img>
    </v-carousel-item>
  </v-carousel>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

@Component
export default class ReportCardImageCarousel extends Vue {
  @Prop({ type: Array, default: () => [] })
  public images!: string[];
}
</script>
