<template>
  <div>
    <report-card-edit
      v-on="$listeners"
      v-if="edit"
      v-bind="{ ...$props, ...$attrs }"
    ></report-card-edit>
    <report-card-small
      v-on="$listeners"
      v-else-if="dense"
      v-bind="{ ...$props, ...$attrs }"
    ></report-card-small>
    <report-card-large
      v-on="$listeners"
      v-else
      v-bind="{ ...$props, ...$attrs }"
    ></report-card-large>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import ReportCardEdit from "./ReportCardEdit.vue";
import ReportCardSmall from "./ReportCardSmall.vue";
import ReportCardLarge from "./ReportCardLarge.vue";

@Component({
  components: {
    ReportCardEdit,
    ReportCardSmall,
    ReportCardLarge
  }
})
export default class ReportCard extends Vue {
  @Prop(Boolean)
  public edit!: boolean;

  @Prop(Boolean)
  public dense!: boolean;

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
  public intendReason!: string;

  @Prop()
  public offence!: string;

  @Prop()
  public address!: string;

  @Prop(Number)
  public plateCount!: number;

  @Prop(Object)
  public location!: {
    lat: number,
    lon: number
  }

  @Prop({ type: Array, default: () => [] })
  public images!: {
    src: string;
    thumbnail: string;
  }[];
}
</script>
