import { database as databaseFunctions, config } from 'firebase-functions'
import * as nodeGeocoder from 'node-geocoder'

const geocoder = nodeGeocoder({
  provider: config().geocoder.provider,
  language: config().geocoder.language,
  apiKey: config().geocoder.api_key
})

export const geoCoding = databaseFunctions.ref('/images/{id}/loc').onWrite(async (change, context) => {
  const newLon = change.after.child('lon').val()
  const newLat = change.after.child('lat').val()
  if (newLon && newLat && (newLon !== change.before.child('lon').val() || newLat !== change.before.child('lat').val())) {
    const [{ formattedAddress: address }] = await geocoder.reverse({ lat: newLat, lon: newLon })
    console.log(`Lat ${newLat}, Lon ${newLon} -> ${address}`)
    change.after.ref.parent.child('address').set(address)
  }
})
