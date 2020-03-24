import ReportCard from "@/components/report-card/ReportCard.vue";

export default {
  component: ReportCard,
  title: "Report Card"
};

const images = [
  {
    src:
      "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
    thumbnail:
      "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
  },
  {
    src:
      "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
    thumbnail:
      "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
  },
  {
    src:
      "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
    thumbnail:
      "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
  }
];
export const dense = () => ({
  components: { ReportCard },
  template: `<report-card dense :images='${JSON.stringify(images)}' license-plate="HH AB 1234" date="2020-03-21 23:32" offence="Geh-/Radweg" address="Nöldeckestraße 23, 21034 Hamburg, Germany" parking endangering></report-card>`
});

export const denseWithAddress = () => ({
  components: { ReportCard },
  template: `<report-card dense show-address :images='${JSON.stringify(images)}' license-plate="HH AB 1234" date="2020-03-21 23:32" offence="Geh-/Radweg" address="Nöldeckestraße 23, 21034 Hamburg, Germany" parking endangering></report-card>`
});

export const large = () => ({
  components: { ReportCard },
  template:
    `<report-card :images='${JSON.stringify(images)}' license-plate="HH AB 1234" date="2020-03-21 23:32" offence="Geh-/Radweg" address="Nöldeckestraße 23, 21034 Hamburg, Germany" parking endangering></report-card>`
});

export const edit = () => ({
  components: { ReportCard },
  template: `<report-card edit :images='${JSON.stringify(images)}' license-plate="HH AB 1234" date="2020-03-21 23:32" offence="Geh-/Radweg" address="Nöldeckestraße 23, 21034 Hamburg, Germany" parking endangering></report-card>`
});

export const editSingleImage = () => ({
  components: { ReportCard },
  template: `<report-card edit :images='${JSON.stringify(
    [images[0]]
  )}' license-plate="HH AB 1234" date="2020-03-21 23:32" offence="Geh-/Radweg" address="Nöldeckestraße 23, 21034 Hamburg, Germany" parking endangering></report-card>`
});
