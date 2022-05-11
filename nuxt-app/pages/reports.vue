<script lang="ts" setup>
const images = useUserReports();
const imagesAsArray = computed(() => Object.entries(images.value).map(([key, value]) => ({... value, '.key': key})))
</script>

<template>
  <div>
    <prime-data-view :value="imagesAsArray" layout="grid" data-key=".key" sort-field="date" :sort-order="-1" paginatorPosition="both" :paginator="true" :rows="30">
      <template #list="slotProps" >
        <div>Vin: <b>{{slotProps.data}}</b></div>
      </template>
      <template #grid="slotProps">
        <div class="col-12 lg:col-4 md:col-6 xl:col-2 p-2">
          <report-card-small
            :parking="slotProps.data.parking ?? false"
            :endangering="slotProps.data.endangering ?? false"
            :obstruction="slotProps.data.obstruction ?? false"
            :with-intend="slotProps.data.withIntend ?? false"
            :offence="slotProps.data.where"
            :licensePlate="slotProps.data.plate"
            :date="slotProps.data.date"
            :address="slotProps.data.address"
            :plateCount="2"
            :images="slotProps.data.filePath ? [slotProps.data.filePath] : []"
            ></report-card-small>
        </div>
      </template>
    </prime-data-view>
  </div>
</template>

<style scoped></style>
