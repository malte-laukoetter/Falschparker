<template>
  <v-data-iterator
    :items="items"
    item-key=".key"
    group-by="date"
    group-desc
    :custom-group="groupItems"
    :expanded="expandable ? items.filter(item => !item.send) : []"
  >
    <template v-slot:default="{ groupedItems, isExpanded, expand }">
      <template v-for="[send, items] of Object.entries(groupedItems)">
        <v-subheader :key="`${send}-subheader`">{{ send }}</v-subheader>
        <v-row align="start" justify="start" :key="send">
          <v-col
            v-for="item in items"
            :key="item['.key']"
            @click="() => expandable && !isExpanded(item) && expand(item, true)"
            :cols="12"
            :sm="6"
            :md="6"
            :lg="4"
            :xl="3"
          >
            <report-card
              @click-image="() => expandable && expand(item, false)"
              :edit="isExpanded(item) && !item.send"
              :dense="!isExpanded(item)"
              :show-address="showAddress"
              :license-plate="item.plate"
              :date="item.date"
              :location="{lat: item.loc.lat, lon: item.loc.lon}"
              :parking="item.parking"
              :endangering="item.endangering"
              :with-intend="item.intend"
              :intend-reason="item.intendReason"
              :offence="item.where"
              :address="item.address"
              :images="item.images"
              @change:license-plate="
                e => publishItemEvent('change:license-plate', item, e)
              "
              @change:date="e => publishItemEvent('change:date', item, e)"
              @change:parking="e => publishItemEvent('change:parking', item, e)"
              @change:endangering="
                e => publishItemEvent('change:endangering', item, e)
              "
              @change:with-intend="
                e => publishItemEvent('change:with-intend', item, e)
              "
              @change:intend-reason="
                e => publishItemEvent('change:intend-reason', item, e)
              "
              @change:offence="e => publishItemEvent('change:offence', item, e)"
              @change:location="e => publishItemEvent('change:location', item, e)"
              @change:address="e => publishItemEvent('change:address', item, e)"
              @send="e => publishItemEvent('send', item)"
              @delete="e => publishItemEvent('delete', item)"
              @delete-image="e => $emit({item: item, image: e})"
            ></report-card>
          </v-col>
        </v-row>
      </template>
    </template>
    <template v-slot:group.header="{ group }">
      <span>{{ group }}</span>
    </template>
  </v-data-iterator>
</template>

<script lang="ts">
import { Component, Vue, Prop } from "vue-property-decorator";
import { ImageData, ParkingPlaces } from "@lergin/hh-report-common";
import ReportCard from "./report-card/ReportCard.vue";

function getNestedValue(
  obj: any,
  path: (string | number)[],
  fallback?: any
): any {
  const last = path.length - 1;

  if (last < 0) return obj === undefined ? fallback : obj;

  for (let i = 0; i < last; i++) {
    if (obj == null) {
      return fallback;
    }
    obj = obj[path[i]];
  }

  if (obj == null) return fallback;

  return obj[path[last]] === undefined ? fallback : obj[path[last]];
}

function getObjectValueByPath(obj: any, path: string, fallback?: any): any {
  // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (obj == null || !path || typeof path !== "string") return fallback;
  if (obj[path] !== undefined) return obj[path];
  path = path.replace(/\[(\w+)\]/g, ".$1"); // convert indexes to properties
  path = path.replace(/^\./, ""); // strip a leading dot
  return getNestedValue(obj, path.split("."), fallback);
}

@Component({
  components: {
    ReportCard
  }
})
export default class ReportCardGrid extends Vue {
  @Prop(Boolean)
  public expandable!: boolean;

  @Prop(Boolean)
  public showAddress!: boolean;

  @Prop(Array)
  public items!: ImageData[];

  groupItems(
    items: ImageData[],
    groupBy: string[],
    groupDesc: boolean[]
  ): Record<string, ImageData[]> {
    const key = groupBy[0];

    if (key === "date") {
      const groupedByMonth: Record<string, ImageData[]> = {};

      if (items.filter(item => !item.send).length > 0) {
        groupedByMonth["Neu / Ungesendet"] = items.filter(item => !item.send);
      }

      for (let item of items
        .filter(item => item.send)
        .sort((a, b) => b.date! - a.date!)) {
        const monthId = new Date(item.date! * 1000).toLocaleString(undefined, {
          month: "long",
          year: "numeric"
        });

        if (!groupedByMonth[monthId]) {
          groupedByMonth[monthId] = [];
        }

        groupedByMonth[monthId].push(item);
      }

      if (!groupDesc) {
        return Object.fromEntries(Object.entries(groupedByMonth).reverse());
      }

      console.log(items.filter(item => !item.send))

      return groupedByMonth;
    } else {
      const key = groupBy[0];
      return items.reduce((acc, item) => {
        const val = getObjectValueByPath(item, key);
        (acc[val] = acc[val] || []).push(item);
        return acc;
      }, {} as Record<string, ImageData[]>);
    }
  }

  publishItemEvent(event: string, item: ImageData, data: unknown) {
    this.$emit(event, { item: item, newValue: data });
  }
}
</script>
