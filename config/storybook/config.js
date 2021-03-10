/* eslint-disable import/no-extraneous-dependencies */
import { configure, addDecorator, addParameters } from "@storybook/vue";
import {
  INITIAL_VIEWPORTS
  // or MINIMAL_VIEWPORTS,
} from "@storybook/addon-viewport";
//import "@/plugins/vuetify";
// src/plugins/vuetify.js
addParameters({
  viewport: {
    viewports: {
      ...INITIAL_VIEWPORTS,
    }
  }
});

import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import colors from "vuetify/src/util/colors";
import de from "vuetify/src/locale/de";

import "@mdi/font/css/materialdesignicons.css"; // Ensure you are using css-loader
Vue.use(Vuetify);

const opts = {
  theme: {
    dark: true,
    themes: {
      light: {
        primary: colors.deepOrange,
        secondary: colors.amber,
        accent: colors.blue,
        error: "#FF5252",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FFC107"
      },
      dark: {
        primary: colors.deepOrange,
        secondary: colors.amber,
        accent: colors.blue,
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
};

const vuetify = new Vuetify(opts)

//import "@mdi/font/css/materialdesignicons.css";

// Ensures every story is wrapped in a v-app tag
addDecorator(() => ({
  vuetify,
  template: "<v-app><v-content><v-container><story/></v-container></v-content></v-app>"
}));

const req = require.context("@/stories", true, /.stories.js$/);

function loadStories() {
  req.keys().forEach(filename => req(filename));
}

configure(loadStories, module);