import { config, database as databaseFunctions } from 'firebase-functions'
import fetch from 'node-fetch'
import * as FormData from 'form-data'

async function getRefreshToken (code: string) {
  const formData = new FormData()
  formData.append('code', code)
  formData.append('client_id', config().google.auth.client_id)
  formData.append('client_secret', config().google.auth.client_secret)
  formData.append('grant_type', 'authorization_code')
  formData.append('redirect_uri', "http://localhost:8080")

  const result = await fetch('https://www.googleapis.com/oauth2/v4/token', {
    method: 'POST',
    body: formData
  }).then(res => res.json())

  console.log(result)

  return result.refresh_token
}

export const generateRefreshToken = databaseFunctions.ref('/users/{userId}/data/code').onUpdate(async (change, context) => {
  const code = change.after.val()

  change.after.ref.parent.child('refresh_token').set(await getRefreshToken(code))
})
