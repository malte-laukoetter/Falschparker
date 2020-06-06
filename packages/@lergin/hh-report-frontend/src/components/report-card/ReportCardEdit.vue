<template>
  <v-card v-bind="$attrs">
    <v-menu open-on-hover>
      <template v-slot:activator="{ on }">
        <v-btn icon absolute right top style="z-index: 1" v-on="on"
          ><v-icon color="white">mdi-dots-vertical</v-icon></v-btn
        >
      </template>
      <v-list>
        <v-list-item @click="() => {}">
          <v-list-item-icon><v-icon>mdi-image-plus</v-icon></v-list-item-icon>
          <v-list-item-title>Bild hinzufügen</v-list-item-title>
        </v-list-item>
        <v-list-item :disabled="images.length < 2" @click="$emit('delete-image', selectedImage)">
          <v-list-item-icon><v-icon>mdi-image-off</v-icon></v-list-item-icon>
          <v-list-item-title>Bild löschen</v-list-item-title>
        </v-list-item>
        <v-divider class="mx-4 my-2"></v-divider>
        <v-list-item @click="$emit('delete')">
          <v-list-item-icon><v-icon>mdi-delete</v-icon></v-list-item-icon>
          <v-list-item-title>Anzeige löschen</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
    <report-card-image-carousel
      @click-image="() => $emit('click-image')"
      :images="images"
      v-model="selectedImage"
    ></report-card-image-carousel>
    <v-card-text>
      <v-text-field
        filled
        label="Kennzeichen"
        prepend-icon="mdi-car"
        :value="licensePlate"
        @change="e => changeEvent('license-plate', e)"
      ></v-text-field>

      <v-text-field
        class="mt-n2"
        filled
        label="Datum und Uhrzeit"
        prepend-icon="mdi-calendar"
        :value="localeDate"
        @change="e => changeEvent('date', e)"
      ></v-text-field>

      <v-dialog max-width="500">
        <template v-slot:activator="{on}">
          <v-text-field
            class="mt-n2"
            filled
            label="Adresse"
            prepend-icon="mdi-map-marker"
            :value="address"
            @click:prepend="e => on.click(e)"
            @change="e => changeEvent('address', e)"
            v-on="on"
          ></v-text-field>
        </template>
        <GmapMap
          :center="{lat: location.lat, lng: location.lon}"
          :zoom="15"
          style="width: 500px; height: 300px"
          mapTypeId="roadmap"
          :options="{
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false
          }"
        >
          <GmapMarker
            draggable
            :position="{lat: location.lat, lng: location.lon}"
            @dragend="(({latLng: {lat, lng}}) => {
              changeEvent('location', {lon: lng(), lat: lat()})
            })"
          />
        </GmapMap>
      </v-dialog>

      <v-divider class="mt-n2 mb-4"></v-divider>

      <div class="subtitle-1">Typ</div>
      <v-chip-group
        mandatory
        column
        active-class="primary"
        :value="parking"
        @change="e => changeEvent('parking', e)"
      >
        <v-chip :value="true" outlined>Parken</v-chip>
        <v-chip :value="false" outlined>Halten</v-chip>
      </v-chip-group>

      <div class="subtitle-1 mt-2">Ort</div>
      <v-chip-group
        mandatory
        column
        active-class="primary"
        :value="offence"
        @change="e => changeEvent('offence', e)"
      >
        <v-chip
          outlined
          v-for="place in parkingPlaces"
          :key="place"
          :value="place"
          >{{ place }}</v-chip
        >
      </v-chip-group>

      <v-divider class="mt-2"></v-divider>

      <v-switch
        class="mb-n6"
        :value="obstruction"
        inset
        label="Behinderung"
        @change="e => changeEvent('obstruction', e)"
      ></v-switch>

      <v-switch
        class="mb-n6"
        :value="endangering"
        inset
        label="Gefährdung"
        @change="e => changeEvent('endangering', e)"
      ></v-switch>

      <v-divider v-if="withIntend" class="mb-4 mt-4"></v-divider>

      <v-switch
        :value="withIntend"
        inset
        label="Vorsatz"
        @change="e => changeEvent('with-intend', e)"
      ></v-switch>
      <v-textarea
        :value="intendReason"
        class="mt-n2"
        v-if="withIntend"
        filled
        rows="1"
        auto-grow
        label="Begründung"
        dense
        append-icon="mdi-pencil"
        @change="e => changeEvent('intend-reason', e)"
      ></v-textarea>
    </v-card-text>

    <v-card-actions class="mt-n6">
      <v-btn block color="primary" @click="$emit('send')"
        ><v-icon class="mr-2">mdi-send</v-icon> Anzeige Verschicken</v-btn
      >
    </v-card-actions>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ParkingPlaces } from "@lergin/hh-report-common";
import ReportCardTagLine from "./ReportCardTagLine.vue";
import ReportCardImageCarousel from "./ReportCardImageCarousel.vue";

@Component({
  components: {
    ReportCardTagLine,
    ReportCardImageCarousel
  }
})
export default class ReportCardEdit extends Vue {
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
  public intendReason!: string;

  @Prop()
  public offence!: ParkingPlaces;

  @Prop()
  public address!: string;

  @Prop({type: Object, default: () => ({lat: 0, lon: 0})})
  public location!: {
    lat: number,
    lon: number
  }

  @Prop()
  public thumbnail!: string;

  @Prop()
  public imageUrl!: string;

  @Prop({ type: Array, default: () => [] })
  public images!: {
    src: string;
    thumbnail: string;
  }[];

  private parkingPlaces: ParkingPlaces[] = [
    ParkingPlaces.BTK_712037,
    ParkingPlaces.BTK_712031,
    ParkingPlaces.BTK_741033,
    ParkingPlaces.BTK_741034_1,
    ParkingPlaces.BTK_741034_2,
    ParkingPlaces.BTK_742107,
    ParkingPlaces.BTK_712029,
    ParkingPlaces.BTK_712033,
    ParkingPlaces.BTK_741015,
    ParkingPlaces.BTK_741017,
    ParkingPlaces.BTK_741018
  ];

  get localeDate() {
    return new Date(this.date * 1000).toLocaleString(undefined, {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    });
  }

  changeEvent(field: string, newValue: unknown) {
    console.log(`change:${field}`, newValue)
    this.$emit(`change:${field}`, newValue);
  }
}
</script>
