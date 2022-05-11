import PrimeVue from "primevue/config";
import Button from "primevue/button";
import DataView from 'primevue/dataview';
import Card from 'primevue/card';
import Image from 'primevue/image';


export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.use(PrimeVue, {ripple: true});

    nuxtApp.vueApp.component('prime-button', Button);
    nuxtApp.vueApp.component('prime-data-view', DataView);
    nuxtApp.vueApp.component('prime-card', Card);
    nuxtApp.vueApp.component('prime-image', Image);
});
