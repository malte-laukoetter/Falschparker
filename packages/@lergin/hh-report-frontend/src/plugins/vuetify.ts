import Vue from 'vue'
import Vuetify from 'vuetify/lib'
//import 'vuetify/src/stylus/app.styl'
import de from 'vuetify/src/locale/de'
import colors from 'vuetify/src/util/colors'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)

export default new Vuetify({
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.deepOrange,
        secondary: colors.amber,
        accent: colors.blue,
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      },
      dark: {
        primary: colors.deepOrange,
        secondary: colors.amber,
        accent: colors.blue,
        error: '#FF5252',
        info: '#2196F3',
        success: '#4CAF50',
        warning: '#FFC107'
      }
    }
  },
  customProperties: true,
  icons: {
    iconfont: 'md'
  },
  lang: {
    locales: { de },
    current: 'de'
  }
})
