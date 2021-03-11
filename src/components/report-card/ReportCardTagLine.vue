<template>
  <span class="overline">{{ tagLine }}</span>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ParkingPlaces } from '../../../functions/lib/ParkingPlaces';

@Component
export default class ReportCardTagLine extends Vue {
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

  get tags() {
    let tags = [];

    if (this.parking) {
      tags.push("Parken");
    } else {
      tags.push("Halten");
    }

    tags.push(this.offence);

    if (this.obstruction) {
      tags.push("Behinderung");
    }

    if (this.endangering) {
      tags.push("Gefährdung");
    }

    if (this.withIntend) {
      tags.push("Vorsatz");
    }

    return tags;
  }

  get tagLine() {
    return this.tags.join(" • ");
  }
}
</script>
