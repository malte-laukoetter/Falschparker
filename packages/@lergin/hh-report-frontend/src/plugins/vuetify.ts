import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'
import de from 'vuetify/src/locale/de'
import colors from 'vuetify/src/util/colors'

Vue.use(Vuetify, {
  theme: {
    primary: colors.deepOrange,
    secondary: colors.amber,
    accent: colors.blue,
    error: '#FF5252',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107'
  },
  customProperties: true,
  iconfont: 'md',
  lang: {
    locales: { de },
    current: 'de'
  }
})
