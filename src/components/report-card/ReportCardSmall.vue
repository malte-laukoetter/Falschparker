<template>
<v-badge
        color="info"
        :content="plateCount"
        :value="plateCount > 1"
        overlap
        bordered
      >
  <v-card v-bind="$attrs">
    <v-list-item three-line>
      <v-list-item-content>
        <div class="overline">{{ localeDate }}</div>
        <v-list-item-title class="headline">{{
          licensePlate
        }}</v-list-item-title>
        <report-card-address-list-item
          v-if="showAddress"
          dense
          class="ml-n3 mt-n1 mb-n1"
          :address="address"
        ></report-card-address-list-item>
        <report-card-tag-line
          v-else
          class="grey--text"
          :parking="parking"
          :obstruction="obstruction"
          :endangering="endangering"
          :with-intend="withIntend"
          :offence="parseTatbestand(offence)"
        ></report-card-tag-line>
      </v-list-item-content>
      <v-list-item-avatar tile size="80">
        <v-img
          @click-image="() => $emit('click-image')"
          :src="`https://storage.cloud.google.com/falschparker-thumbnails/${images[0]}`"
          :aspect-ratio="1 / 1"
        ></v-img>
      </v-list-item-avatar>
    </v-list-item>
    <v-card-text v-if="showAddress" class="mt-n4">
      <report-card-tag-line
        :parking="parking"
        :endangering="endangering"
        :obstruction="obstruction"
        :with-intend="withIntend"
        :offence="parseTatbestand(offence)"
      ></report-card-tag-line>
    </v-card-text>
  </v-card>

  </v-badge>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { TATBESTÄNDE } from '../../../functions/lib/ParkingPlaces';
import ReportCardTagLine from "./ReportCardTagLine.vue";
import ReportCardAddressListItem from "./ReportCardAddressListItem.vue";

@Component({
  components: {
    ReportCardTagLine,
    ReportCardAddressListItem
  }
})
export default class ReportCardSmall extends Vue {
  @Prop(Boolean)
  public showAddress!: boolean;

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
  public offence!: string;

  @Prop()
  public address!: string;

  @Prop()
  public thumbnail!: string;

  @Prop()
  public imageUrl!: string;

  @Prop(Number)
  public plateCount!: number;

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

  parseTatbestand(tatbestandsNummer: string) {
    return TATBESTÄNDE[tatbestandsNummer]?.title ?? tatbestandsNummer
  }
}
</script>
