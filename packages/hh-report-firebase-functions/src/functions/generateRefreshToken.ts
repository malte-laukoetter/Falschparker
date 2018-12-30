import { config, database as databaseFunctions } from 'firebase-functions'
import fetch from 'node-fetch'
import * as FormData from 'form-data'

async function getRefreshToken (code: string) {
  const formData = new FormData()
  formData.append('client_id', config().google.auth.client_id)
  formData.append('client_secret', config().google.auth.client_secret)
  formData.append('code', code)
  formData.append('grant_type', 'http://oauth.net/grant_type/device/1.0')

  const { refresh_token: refreshToken } = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: formData
  }).then(res => res.json())

  return refreshToken
}

export const generateRefreshToken = databaseFunctions.ref('/users/{userId}/data/code').onUpdate(async (change, context) => {
  const code = change.after.val()

  change.after.ref.parent.child('refresh_token').set(await getRefreshToken(code))
})
