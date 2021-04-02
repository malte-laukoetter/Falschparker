<template>
  <v-carousel
    :height="null"
    :hide-delimiters="images.length < 2"
    :show-arrows="images.length > 1"
    show-arrows-on-hover
  >
    <v-carousel-item v-for="image in images" :key="image.src">
      <v-img
        :lazy-src="image.thumbnail ? image.thumbnail.replace('googleapis', 'cloud.google') : ''"
        :src="image.src ? image.src.replace('googleapis', 'cloud.google') : ''"
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
  public images!: {
    src: string;
    thumbnail: string;
  }[];
}
</script>
