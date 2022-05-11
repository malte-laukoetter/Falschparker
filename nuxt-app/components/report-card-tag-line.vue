<script lang="ts" setup>
import { TATBESTÄNDE } from '~/lib/ParkingPlaces';

const props = defineProps({
  parking: {type: Boolean, required: true},
  endangering: {type: Boolean, required: true},
  obstruction: {type: Boolean, required: true},
  withIntend: {type: Boolean, required: true},
  offence: {type: String, required: true}
})

const tags = computed(() => {
  let tags: string[] = [];

  if (props.parking) {
    tags.push("Parken");
  } else {
    tags.push("Halten");
  }

  tags.push(TATBESTÄNDE[props.offence]?.title ?? props.offence);

  if (props.obstruction) {
    tags.push("Behinderung");
  }

  if (props.endangering) {
    tags.push("Gefährdung");
  }

  if (props.withIntend) {
    tags.push("Vorsatz");
  }

  console.log(tags)

  return tags;
})

const tagLine = computed(() => tags.value.join(" • "))
</script>

<template>
  <span class="overline">{{ tagLine }}</span>
</template>

<style scoped></style>
