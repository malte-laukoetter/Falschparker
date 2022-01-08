import { config, database as databaseFunctions, logger } from 'firebase-functions'
import fetch from 'node-fetch'
import FormData from 'form-data'

async function getRefreshToken (code: string) {
  const formData = new FormData()
  formData.append('code', code)
  formData.append('client_id', config().google.auth.client_id)
  formData.append('client_secret', config().google.auth.client_secret)
  formData.append('grant_type', 'authorization_code')
  formData.append('redirect_uri', config().google.auth.redirect_uri)

  const result = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    body: formData
  }).then(res => res.json());

  logger.log(result);

  return result.refresh_token
}

export const generateRefreshToken = databaseFunctions.ref('/users/{userId}/data/code').onUpdate(async (change, context) => {
  const code = change.after.val()

  change.after.ref.parent.child('refresh_token').set(await getRefreshToken(code))
})
