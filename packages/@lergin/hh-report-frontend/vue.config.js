module.exports = {
  pwa: {
    name: 'Falschparker',
    workboxOptions: {
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/storage\.googleapis\.com\/.*thumb/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'falschparker-image-thumb-cache',
            expiration: {
              maxEntries: 1000,
              purgeOnQuotaError: true
            },
            fetchOptions: {
              mode: 'no-cors',
            },
            matchOptions: {
              ignoreSearch: true
            }
          }
        },
        {
          urlPattern: /^https:\/\/storage\.googleapis\.com\/'/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'falschparker-image-cache',
            expiration: {
              maxEntries: 50,
              purgeOnQuotaError: true
            },
            fetchOptions: {
              mode: 'no-cors',
            },
            matchOptions: {
              ignoreSearch: true
            }
          }
        },
        {
          urlPattern: /^https:\/\/stamen-tiles-[abcd]\.a\.ssl\.fastly\.net|^https:\/\/[abcd]\.basemaps\.cartocdn\.com|^http:\/\/[abc]\.tile\.osm\.org/,
          handler: 'staleWhileRevalidate',
          options: {
            cacheName: 'falschparker-maptiles-cache',
            expiration: {
              maxEntries: 500,
              maxAgeSeconds: 60 * 60 * 24 * 7,
              purgeOnQuotaError: true
            },
            fetchOptions: {
              mode: 'no-cors',
            },
            matchOptions: {
              ignoreSearch: true
            }
          }
        }
      ]
    }
  },
  lintOnSave: false
}
