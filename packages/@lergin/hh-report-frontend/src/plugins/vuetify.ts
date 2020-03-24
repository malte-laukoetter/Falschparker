import Vue from 'vue'
import Vuetify from 'vuetify/lib'
//import 'vuetify/src/stylus/app.styl'
import de from 'vuetify/src/locale/de'
import colors from 'vuetify/src/util/colors'
import 'vuetify/dist/vuetify.min.css'
import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader

Vue.use(Vuetify)



export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: "#ad9d5d",
        secondary: "#444b6e",
        accent: "#444b6e",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      },
      dark: {
        primary: "#008282",
        secondary: "#7f753c",
        accent: "#7f753c",
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      }
    }
  },
  customProperties: true,
  icons: {
    iconfont: "mdi"
  },
  lang: {
    locales: { de },
    current: "de"
  }
});
