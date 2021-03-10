<template>
  <v-list-item v-bind="$attrs" :dense="dense">
    <v-list-item-action v-if="dense">
      <v-icon color="grey lighten-1">mdi-map-marker</v-icon>
    </v-list-item-action>
    <v-list-item-content :class="{ 'ml-n5': dense }">
      <v-list-item-title>{{ addressLine1 }}</v-list-item-title>
      <v-list-item-subtitle>{{ addressLine2 }}</v-list-item-subtitle>
    </v-list-item-content>
    <v-list-item-action v-if="!dense">
      <v-icon color="grey lighten-1">mdi-map-marker</v-icon>
    </v-list-item-action>
  </v-list-item>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";

const ADDRESS_LINE_SPLIT_REGEXP: RegExp = /, \d{5} /;

@Component
export default class ReportCardImageCarousel extends Vue {
  @Prop()
  public address!: string;

  @Prop(Boolean)
  public dense!: boolean;

  get addressLine1() {
    return this.address.split(ADDRESS_LINE_SPLIT_REGEXP)[0];
  }

  get addressLine2() {
    return this.address.substring(
      this.address.split(ADDRESS_LINE_SPLIT_REGEXP)[0].length + 2
    );
  }
}
</script>
