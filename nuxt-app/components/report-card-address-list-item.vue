<script lang="ts" setup>
const props = defineProps({
  dense: {type: Boolean, default: false},
  address: {type: String, required: true}
});

const ADDRESS_LINE_SPLIT_REGEXP: RegExp = /, \d{5} /;

const addressLine1 = computed(() => props.address.split(ADDRESS_LINE_SPLIT_REGEXP)[0]);
const addressLine2 = computed(() => props.address.substring(props.address.split(ADDRESS_LINE_SPLIT_REGEXP)[0].length + 2));
</script>

<template>
<div class="address-item">
  <div class="address-item-content">
    <div class="address-line-1">{{addressLine1}}</div>
    <div class="address-line-2">{{addressLine2}}</div>
  </div>
  <div class="address-item-action">
    <i class="pi pi-map-marker"></i>
  </div>
</div>
</template>

<style scoped>
.address-item {
	display: flex;
	align-items: center;
	padding: .5rem;
	width: 100%;
}

.address-item-content {
  flex: 1 1 0;
}

.address-item-action {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}
</style>
