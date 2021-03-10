import ReportCardAddressListItem from "@/components/report-card/ReportCardAddressListItem.vue";

export default {
  component: ReportCardAddressListItem,
  title: "Report Card Address List Item"
};

export const normal = () => ({
  components: { ReportCardAddressListItem },
  template: `<v-list><report-card-address-list-item address="Nöldeckestraße 23, 21034 Hamburg, Germany"></report-card-address-list-item></v-list>`
});

export const dense = () => ({
  components: { ReportCardAddressListItem },
  template: `<v-list><report-card-address-list-item dense address="Nöldeckestraße 23, 21034 Hamburg, Germany"></report-card-address-list-item></v-list>`
});
