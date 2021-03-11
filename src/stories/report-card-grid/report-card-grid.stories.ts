import ReportCardGrid from "@/components/ReportCardGrid.vue";
import { ParkingPlaces } from '../../../functions/lib/ParkingPlaces';

export default {
  component: ReportCardGrid,
  title: "Report Card Grid"
};

const items = [
  {
    ".key": 1,
    plate: "HH AB 1234",
    date: 1584876515118,
    address: "Beim Strohhause 30, 20097 Hamburg, Germany",
    where: ParkingPlaces.BICYCLE_OR_FOOD_PATH,
    send: false,
    location: {
      lat: 52.0,
      lon: 10.0
    },
    images: [
      {
        src:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
        thumbnail:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
      }
    ]
  },
  {
    ".key": 2,
    send: false,
    plate: "HH AB 1234",
    date: 1584876215118,
    address: "Beim Strohhause 30, 20097 Hamburg, Germany",
    where: ParkingPlaces.INTERSECTION,
    location: {
      lat: 52.0,
      lon: 10.0
    },
    images: [
      {
        src:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
        thumbnail:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
      }
    ]
  },
  {
    ".key": 3,
    send: false,
    plate: "HH AB 1234",
    date: 1584876515118,
    address: "Beim Strohhause 30, 20097 Hamburg, Germany",
    where: ParkingPlaces.BICYCLE_OR_FOOD_PATH,
    endangering: true,
    location: {
      lat: 52.0,
      lon: 10.0
    },
    images: [
      {
        src:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
        thumbnail:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
      },
      {
        src:
          "https://m-l.dev/static/9f0c4e3a79f224ad383a1cc72757c388/882c7/map_1.png",
        thumbnail:
          "https://m-l.dev/static/9f0c4e3a79f224ad383a1cc72757c388/882c7/map_1.png"
      }
    ]
  },
  {
    ".key": 4,
    send: true,
    plate: "HH AB 1234",
    date: 1584876515118,
    address: "Beim Strohhause 30, 20097 Hamburg, Germany",
    where: ParkingPlaces.BICYCLE_OR_FOOD_PATH,
    endangering: true,
    location: {
      lat: 52.0,
      lon: 10.0
    },
    images: [
      {
        src:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
        thumbnail:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
      },
      {
        src:
          "https://m-l.dev/static/9f0c4e3a79f224ad383a1cc72757c388/882c7/map_1.png",
        thumbnail:
          "https://m-l.dev/static/9f0c4e3a79f224ad383a1cc72757c388/882c7/map_1.png"
      }
    ]
  }
];

for (let i = 0; i < 20; i++) {
  items.push({
    ".key": 5 + i,
    plate: "HH AB 1234",
    date: 1582871215118,
    address: "Beim Strohhause 30, 20097 Hamburg, Germany",
    where: ParkingPlaces.INTERSECTION,
    send: true,
    location: {
      lat: 52.0,
      lon: 10.0
    },
    images: [
      {
        src:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/d5dd6/header.jpg",
        thumbnail:
          "https://m-l.dev/static/79749212f0c3d7f1d5e580e0242643c3/447be/header.jpg"
      }
    ]
  });
}

export const normal = () => ({
  components: { ReportCardGrid },
  template: `<report-card-grid :items='${JSON.stringify(items)}'></report-card-grid>`
});

export const expandable = () => ({
  components: { ReportCardGrid },
  template: `<report-card-grid expandable :items='${JSON.stringify(items)}'></report-card-grid>`
});

export const showAddress = () => ({
  components: { ReportCardGrid },
  template: `<report-card-grid show-address :items='${JSON.stringify(items)}'></report-card-grid>`
});
