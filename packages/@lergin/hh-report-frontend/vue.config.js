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
