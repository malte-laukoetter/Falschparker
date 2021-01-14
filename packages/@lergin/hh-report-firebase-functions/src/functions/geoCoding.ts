import { database as databaseFunctions, config, Change, logger } from 'firebase-functions'
import nodeGeocoder from 'node-geocoder'

const geocoder = nodeGeocoder({
  provider: config().geocoder.provider,
  language: config().geocoder.language,
  apiKey: config().geocoder.api_key
})


function isLocationChanged({after, before}: Change<databaseFunctions.DataSnapshot>) {
  const newLon = after.child('lon').val()
  const newLat = after.child('lat').val()
  const oldLon = before.child('lon').val()
  const oldLat = before.child('lat').val()

  return newLon && newLat && (newLon !== oldLon ||newLat !== oldLat)
}

export const geoCoding = databaseFunctions.ref('/users/{userId}/images/{id}/loc').onWrite(async (change, context) => {
  if (isLocationChanged(change)) {
    const newLon = change.after.child('lon').val()
    const newLat = change.after.child('lat').val()

    const [
      { formattedAddress: address }
    ] = await geocoder.reverse({ lat: newLat, lon: newLon })

    logger.log(`Lat ${newLat}, Lon ${newLon} -> ${address}`);

    change.after.ref.parent.child('address').set(address)
  }
})
