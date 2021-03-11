<template>
  <v-card v-bind="$attrs">
    <report-card-image-carousel
      @click-image="() => $emit('click-image')"
      :images="images"
    ></report-card-image-carousel>
    <v-card-title class="mt-n2">{{ licensePlate }}</v-card-title>
    <v-card-subtitle>{{ localeDate }}</v-card-subtitle>

    <v-card-text>
      <report-card-tag-line
        :parking="parking"
        :endangering="endangering"
        :obstruction="obstruction"
        :with-intend="withIntend"
        :offence="offence"
      ></report-card-tag-line>
    </v-card-text>

    <v-list class="mt-n4">
      <report-card-address-list-item
        :address="address"
        ripple
        @click="() => {}"
      ></report-card-address-list-item>
    </v-list>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ParkingPlaces } from '../../../functions/lib/ParkingPlaces';
import ReportCardTagLine from "./ReportCardTagLine.vue";
import ReportCardImageCarousel from "./ReportCardImageCarousel.vue";
import ReportCardAddressListItem from "./ReportCardAddressListItem.vue";

@Component({
  components: {
    ReportCardTagLine,
    ReportCardImageCarousel,
    ReportCardAddressListItem
  }
})
export default class ReportCardLarge extends Vue {
  @Prop()
  public licensePlate!: string;

  @Prop()
  public date!: number;

  @Prop(Boolean)
  public parking!: boolean;

  @Prop(Boolean)
  public endangering!: boolean;

  @Prop(Boolean)
  public obstruction!: boolean;

  @Prop(Boolean)
  public withIntend!: boolean;

  @Prop()
  public offence!: ParkingPlaces;

  @Prop()
  public address!: string;

  @Prop()
  public thumbnail!: string;

  @Prop()
  public imageUrl!: string;

  @Prop({ type: Array, default: () => [] })
  public images!: {
    src: string;
    thumbnail: string;
  }[];

  get localeDate() {
    return new Date(this.date * 1000).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  }
}
</script>
