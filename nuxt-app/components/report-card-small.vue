<script lang="ts" setup>
import { TATBESTÄNDE } from '~/lib/ParkingPlaces';

interface Props {
  parking: boolean;
  endangering: boolean;
  obstruction: boolean;
  withIntend: boolean;
  offence: string;
  licensePlate: string;
  date: number;
  address: string;
  plateCount: number;
  images: string[]
}

const props = defineProps<Props>()

const localDate = computed(() => new Date(props.date * 1000).toLocaleString(undefined, {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric"
}));

const parsedOffence = computed(() => TATBESTÄNDE[props.offence]?.title ?? props.offence)
</script>

<template>
  <div class="card surface-300 border-round">
    <div class="report-item-image">
      <img class="border-round-left" v-if="props.images[0]" :src="`https://storage.cloud.google.com/falschparker-thumbnails/${props.images[0]}`" />
    </div>
    <div class="report-item-content flex flex-column h-full p-1">
      <div class="font-light text-sm">{{localDate}}</div>
      <div class="text-xl mt-1">{{props.licensePlate}}</div>
      <div class="flex-grow-1"></div>
      <report-card-tag-line class="text-sm" :parking="props.parking" :endangering="props.endangering" :obstruction="props.obstruction" :with-intend="props.withIntend" :offence="parsedOffence"></report-card-tag-line>
    </div>
  </div>
</template>

<style scoped>
.card {
	display: flex;
	align-items: center;
	width: 100%;
  height: 100px;
}

img {
  aspect-ratio: 1/1;
  object-fit: cover;
  height: 100%;
  width: 100%;
}

.report-item-content {
  flex: 1 1 0;
}

.report-item-image {
  width: 100px;
}

</style>
