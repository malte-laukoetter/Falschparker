process.env.VUE_APP_BUILD_DATE = new Date().toISOString();

module.exports = {
  pwa: {
    name: 'Falschparker',
    workboxOptions: {
      swSrc: './src/service-worker.js'
    },
    workboxPluginMode: 'InjectManifest'
  },
  lintOnSave: false
}
