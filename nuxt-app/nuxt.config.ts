import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  app: {
    head: {
      script: [
        {
          src: "https://apis.google.com/js/client:platform.js?onload=start",
          async: true,
          defer: true
        }
      ]
    },
  },
  css: [
    'primevue/resources/themes/saga-blue/theme.css',
    'primevue/resources/primevue.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css'
  ],
  build: {
      transpile: ['primevue']
  },
  ssr: false
})
